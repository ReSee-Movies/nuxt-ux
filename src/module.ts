import { installModule, addComponentsDir, createResolver, defineNuxtModule, addImportsDir } from '@nuxt/kit';
import { importCSS } from './utils/import-css';
import { importTailwind } from './utils/import-tailwind';


export interface ModuleOptions {
  plugins?: string[];
  sources?: string[];
  imports?: string[];
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

    const resolver   = createResolver(import.meta.url);
    const components = resolver.resolve('./runtime/components/');

    addComponentsDir({ path: components });

    const sources = options.sources?.slice() ?? [];
    const plugins = options.plugins?.slice() ?? [];
    const imports = options.plugins?.slice() ?? [];

    sources.push(components);
    plugins.push('@egoist/tailwindcss-icons');
    imports.push(resolver.resolve('./runtime/css/theme.css'));

    nuxt.hook('modules:done', async () => {
      await importCSS(nuxt, { sources, plugins, imports });
    });

    await installModule('@primevue/nuxt-module', {
      autoImport : false,
      loadStyles : false,

      options: {
        unstyled: true,
      },

      directives: {
        prefix  : 'Prime',
        include : [],
      },

      components: {
        prefix  : 'Prime',
        include : [],
      },

      composables: {
        include: [],
      },
    }, nuxt);
  },
});
