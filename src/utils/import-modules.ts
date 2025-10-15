import type { ModuleDependencies } from '@nuxt/schema';


/**
 * Appends the config with additional modules that this one
 * relies on.
 */
export function importModules() {
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

  const Primevue: ModuleDependencies['@primevue/nuxt-module'] = {
    defaults: {
      autoImport : false,
      loadStyles : false,

      importPT: {
        from: '#resee-movies-nuxt-ux-primevue-passthrough',
      },

      options: {
        unstyled: true,
      },

      composables: {
        include: ['useToast'],
      },

      directives: {
        prefix  : 'Prime',
        include : ['Tooltip'],
      },

      components: {
        prefix  : 'Prime',
        include : ['Drawer', 'Message', 'ProgressBar', 'ProgressSpinner', 'Tag', 'Toast'],
      },
    },
  };

  return {
    '@nuxt/fonts': NuxtFonts,
    '@primevue/nuxt-module': Primevue,
  };
}
