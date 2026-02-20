import type { ModuleDependencies, Nuxt } from '@nuxt/schema';
import type { ModuleOptions } from '#resee-ux/types';


export type NuxtFontsConfig    = Exclude<ModuleDependencies['@nuxt/fonts'], false | undefined>;
export type NuxtDeviceConfig   = Exclude<ModuleDependencies['@nuxtjs/device'], false | undefined>;
export type NuxtPiniaConfig    = Exclude<ModuleDependencies['@pinia/nuxt'], false | undefined>;
export type NuxtPrimevueConfig = Exclude<ModuleDependencies['@primevue/nuxt-module'], false | undefined>;

export type NuxtUxModuleDependencies = {
  '@nuxt/fonts'           : NuxtFontsConfig;
  '@nuxtjs/device'        : NuxtDeviceConfig;
  '@pinia/nuxt'           : NuxtPiniaConfig;
  '@primevue/nuxt-module' : NuxtPrimevueConfig;
};


/**
 * Appends the config with additional modules that this one
 * relies on.
 */
export function importModules(nuxt: Nuxt): NuxtUxModuleDependencies {
  /* *****************************
   * Nuxt Fonts
   * ***************************** */
  const NuxtFonts: NuxtFontsConfig = {
    defaults: {
      provider: 'google',

      families: [
        {
          name     : 'Archivo',
          provider : 'google',
          styles   : ['normal'],
          weights  : [200, 300, 400, 500],
          preload  : true,
        },
      ],
    }
  }


  /* *****************************
   * Nuxt Device
   * ***************************** */
  const NuxtDevice: NuxtDeviceConfig = {};


  /* *****************************
   * Pinia
   * ***************************** */
  const Pinia: NuxtPiniaConfig = {};


  /* *****************************
   * Primevue
   * ***************************** */
  const primeOptions    = (nuxt.options.ux || {}).primevue as ModuleOptions['primevue'];
  const componentPrefix = primeOptions?.componentPrefix ?? 'Prime';

  const primeComponents = Array.from(
    new Set([
      'Accordion',
      'Checkbox',
      'Dialog',
      'Drawer',
      'Form',
      'FormField',
      'InputText',
      'Message',
      'Menu',
      'MultiSelect',
      'ProgressBar',
      'ProgressSpinner',
      'Select',
      'Tag',
      'Textarea',
      'Toast',
      'ToggleSwitch',
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

  const Primevue: NuxtPrimevueConfig = {
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
    '@nuxt/fonts'           : NuxtFonts,
    '@primevue/nuxt-module' : Primevue,
    '@nuxtjs/device'        : NuxtDevice,
    '@pinia/nuxt'           : Pinia,
  };
}
