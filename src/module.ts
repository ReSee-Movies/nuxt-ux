import { addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit';
import { importCSS } from './utils/import-css';
import { importTailwind } from './utils/import-tailwind';


export interface ModuleOptions {}

export interface ModuleHooks {
  /** Allows extending sources for Tailwind CSS. */
  'tailwindcss:sources:extend': (sources: string[]) => void;
}

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}


export default defineNuxtModule<ModuleOptions>({
  defaults: {},

  meta: {
    name      : '@resee-movies/nuxt-ux',
    configKey : 'ux',
  },

  async setup(_options, nuxt) {
    await importTailwind(nuxt);

    const resolver   = createResolver(import.meta.url)
    const components = resolver.resolve('./runtime/components');

    addComponentsDir({ path: components });

    nuxt.hook('modules:done', async () => {
      await importCSS(nuxt, [components]);
    });
  },
});
