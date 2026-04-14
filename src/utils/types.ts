export interface ModuleOptions {
  defaultColorMode?            : 'lite' | 'dark';
  usePreferredColorScheme?     : boolean;
  componentPrefix?             : string;
  reseeImageBaseUrl?           : string;
  tmdbImageBaseUrl?            : string;
  disableSourceMapWarningsFor? : string[];

  tailwind?: {
    plugins? : (string | undefined)[];
    sources? : (string | undefined)[];
    imports? : (string | undefined)[];
  };

  primevue?: {
    passthroughImport? : string;
    componentPrefix?   : string;
    includeComponents? : string[];
  };
}

export interface ReseeUxPublicRuntimeConfig {
  reseeImageBaseUrl? : string;
  tmdbImageBaseUrl?  : string;
}

export interface ModuleHooks {
  /** Allows extending sources for Tailwind CSS. */
  'tailwindcss:sources:extend': (sources: string[]) => void;
}

declare module '@nuxt/schema' {
  /* interface NuxtHooks extends ModuleHooks {} */

  interface PublicRuntimeConfig {
    ux?: ReseeUxPublicRuntimeConfig;
  }
}
