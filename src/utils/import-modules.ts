import type { ModuleDependencies, Nuxt } from '@nuxt/schema';
import type { ModuleOptions } from '../runtime/types';


/**
 * Appends the config with additional modules that this one
 * relies on.
 */
export function importModules(nuxt: Nuxt) {
  const NuxtFonts: ModuleDependencies['@nuxt/fonts'] = {
    defaults: {
      families: [
        {
          name     : 'Archivo',
          provider : 'google',
          styles   : ['normal'],
          weights  : [200, 300, 400, 500],
        },
      ],
    }
  }

  const primeOptions = nuxt.options.ux?.primevue as ModuleOptions['primevue'];
  const componentPrefix = primeOptions?.componentPrefix ?? 'Prime';

  const primeComponents = Array.from(
    new Set([
      'Dialog',
      'Drawer',
      'Message',
      'Menu',
      'ProgressBar',
      'ProgressSpinner',
      'Tag',
      'Toast',
      ...(primeOptions?.includeComponents ?? []),
    ]),
  )

  nuxt.options.vite.optimizeDeps ??= {};
  nuxt.options.vite.optimizeDeps.include ??= [];

  nuxt.options.vite.optimizeDeps.include.push(
    'primevue/usetoast',
    'primevue/toasteventbus',
    'primevue/toastservice',
  );

  const Primevue: ModuleDependencies['@primevue/nuxt-module'] = {
    defaults: {
      autoImport : false,
      loadStyles : false,

      importPT: {
        from: '#resee-movies-nuxt-ux-primevue-passthrough',
      },

      options: {
        unstyled: true,

        zIndex: {
          overlay : 800,
          modal   : 850,
          menu    : 900,
          tooltip : 1000,
        },
      },

      composables: {
        include: ['usePrimeVue', 'useToast'],
      },

      directives: {
        prefix  : componentPrefix,
        include : ['Tooltip'],
      },

      components: {
        prefix  : componentPrefix,
        include : primeComponents,
      },
    },
  };

  return {
    '@nuxt/fonts': NuxtFonts,
    '@primevue/nuxt-module': Primevue,
  };
}
