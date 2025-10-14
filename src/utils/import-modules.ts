import { installModule, useNuxt } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';
import NuxtFontsModule from '@nuxt/fonts';
import NuxtPrimevueModule from '@primevue/nuxt-module';


/**
 * Appends the config with additional modules that this one
 * relies on.
 */
export async function importModules(nuxt: Nuxt = useNuxt()) {
  // @ts-expect-error
  await installModule(NuxtFontsModule, {
    families: [
      {
        name     : 'Archivo',
        provider : 'google',
        styles   : ['normal'],
        weights  : [200, 300, 400, 500],
      },
    ],
  });

  await installModule(NuxtPrimevueModule, {
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
