import {
  addComponentsDir,
  addImportsDir,
  addServerScanDir,
  addTemplate,
  createResolver,
  defineNuxtModule,
  resolvePath,
} from '@nuxt/kit';
import type { ModuleOptions } from './runtime/types';
import { importCSS } from './utils/import-css';
import { importModules } from './utils/import-modules';
import { importTailwind } from './utils/import-tailwind';


export default defineNuxtModule<ModuleOptions>({
  defaults: {
    componentPrefix: 'Ui',
  },

  meta: {
    name      : '@resee-movies/nuxt-ux',
    configKey : 'ux',
  },

  moduleDependencies: (nuxt) => importModules(nuxt),

  async setup(options, nuxt) {
    const resolver    = createResolver(import.meta.url);
    const components  = resolver.resolve('./runtime/components/');
    const composables = resolver.resolve('./runtime/composables/');
    const server      = resolver.resolve('./runtime/server/');
    const stylesheet  = resolver.resolve('./runtime/theme/css/styles.css');

    nuxt.options.alias['#resee-ux'] = resolver.resolve('./runtime');

    const sources = options.tailwind?.sources?.slice() ?? [];
    const plugins = options.tailwind?.plugins?.slice() ?? [];
    const imports = options.tailwind?.plugins?.slice() ?? [];

    sources.push(components);
    plugins.push(await resolvePath('@egoist/tailwindcss-icons'));
    imports.push(stylesheet);

    addComponentsDir({ path: components, prefix: options.componentPrefix });
    addImportsDir([ composables ]);
    addServerScanDir([ server ]);

    await importTailwind(nuxt);

    nuxt.hook('modules:done', async () => {
      await importCSS(nuxt, { sources, plugins, imports });
    });


    // ----------------------------
    // Primevue Passthrough
    // ----------------------------
    let primePassthroughFilename = await resolver.resolvePath('./runtime/theme/primevue/index', {
      extensions: ['ts', 'js'],
    });

    if (options.primevue?.passthroughImport) {
      const ownPassthroughFilename = primePassthroughFilename;

      primePassthroughFilename = addTemplate({
        filename : 'resee-movies-nuxt-ux-primevue-passthrough.js',
        write    : true,

        // language=js
        getContents: () => `
          import OwnPassthrough from '${ ownPassthroughFilename }';
          import ExtPassthrough from '${ options.primevue?.passthroughImport }';

          export default { ...OwnPassthrough, ...ExtPassthrough };
        `,
      }).dst;
    }

    nuxt.options.alias['#resee-movies-nuxt-ux-primevue-passthrough'] = primePassthroughFilename;
  },
});
