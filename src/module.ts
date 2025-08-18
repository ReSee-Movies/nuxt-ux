import { addComponentsDir, addImportsDir, addServerScanDir, createResolver, defineNuxtModule } from '@nuxt/kit';
import { ModuleOptions } from './runtime/types';
import { importCSS } from './utils/import-css';
import { importModules } from './utils/import-modules';
import { importTailwind } from './utils/import-tailwind';


export default defineNuxtModule<ModuleOptions>({
  defaults: {},

  meta: {
    name      : '@resee-movies/nuxt-ux',
    configKey : 'ux',
  },

  async setup(options, nuxt) {
    const resolver    = createResolver(import.meta.url);
    const components  = resolver.resolve('./runtime/components/');
    const composables = resolver.resolve('./runtime/composables/');
    const server      = resolver.resolve('./runtime/server/');
    const stylesheet  = resolver.resolve('./runtime/theme/css/styles.css');

    const sources = options.tailwind?.sources?.slice() ?? [];
    const plugins = options.tailwind?.plugins?.slice() ?? [];
    const imports = options.tailwind?.plugins?.slice() ?? [];

    sources.push(components);
    plugins.push('@egoist/tailwindcss-icons');
    imports.push(stylesheet);

    addComponentsDir({ path: components });
    addImportsDir([ composables ]);
    addServerScanDir([ server ]);

    await importTailwind(nuxt);
    await importModules(nuxt);

    nuxt.hook('modules:done', async () => {
      await importCSS(nuxt, { sources, plugins, imports });
    });
  },
});
