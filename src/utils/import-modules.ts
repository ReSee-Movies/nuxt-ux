import { installModule, useNuxt } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';


/**
 * Appends the config with additional modules that this one
 * relies on.
 */
export async function importModules(nuxt: Nuxt = useNuxt()) {
  await installModule('@nuxt/fonts', {
    families: [
      {
        name     : 'Archivo',
        provider : 'google',
        styles   : ['normal'],
        weights  : [200, 300, 400, 500],
      },
    ],
  });

  await installModule('@primevue/nuxt-module', {
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
      include : ['Message', 'ProgressBar', 'ProgressSpinner', 'Tag', 'Toast'],
    },
  }, nuxt);
}
