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

    options: {
      unstyled: true,
    },

    directives: {
      prefix  : 'Prime',
      include : [],
    },

    composables: {
      include: ['useToast'],
    },

    components: {
      prefix  : 'Prime',
      include : ['Message', 'ProgressBar', 'ProgressSpinner', 'Toast'],
    },
  }, nuxt);
}
