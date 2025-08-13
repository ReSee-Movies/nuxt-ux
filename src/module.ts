import { addComponentsDir, createResolver, defineNuxtModule, addServerScanDir } from '@nuxt/kit';
import { importCSS } from './utils/import-css';
import { importModules } from './utils/import-modules';
import { importTailwind } from './utils/import-tailwind';
import { ModuleOptions } from './runtime/types';


export default defineNuxtModule<ModuleOptions>({
  defaults: {},

  meta: {
    name      : '@resee-movies/nuxt-ux',
    configKey : 'ux',
  },

  async setup(options, nuxt) {
    await importTailwind(nuxt);
    await importModules(nuxt);

    const resolver   = createResolver(import.meta.url);
    const components = resolver.resolve('./runtime/components/');
    const serverDir  = resolver.resolve('./runtime/server/');

    addComponentsDir({ path: components });
    addServerScanDir([ serverDir ]);

    const sources = options.tailwind?.sources?.slice() ?? [];
    const plugins = options.tailwind?.plugins?.slice() ?? [];
    const imports = options.tailwind?.plugins?.slice() ?? [];

    sources.push(components);
    plugins.push('@egoist/tailwindcss-icons');
    imports.push(resolver.resolve('./runtime/css/styles.css'));

    nuxt.hook('modules:done', async () => {
      await importCSS(nuxt, { sources, plugins, imports });
    });
  },
});
