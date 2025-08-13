import { addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit';
import { importCSS } from './utils/import-css';
import { importModules } from './utils/import-modules';
import { importTailwind } from './utils/import-tailwind';


export interface ModuleOptions {
  tailwind?: {
    plugins?: string[];
    sources?: string[];
    imports?: string[];
  };
}

export interface ModuleHooks {
  /** Allows extending sources for Tailwind CSS. */
  'tailwindcss:sources:extend': (sources: string[]) => void;
}

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}


export default defineNuxtModule<ModuleOptions>({
  defaults: {
    plugins: [],
    sources: [],
    imports: [],
  },

  meta: {
    name      : '@resee-movies/nuxt-ux',
    configKey : 'ux',
  },

  async setup(options, nuxt) {
    await importTailwind(nuxt);
    await importModules(nuxt);

    const resolver   = createResolver(import.meta.url);
    const components = resolver.resolve('./runtime/components/');

    addComponentsDir({ path: components });

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
