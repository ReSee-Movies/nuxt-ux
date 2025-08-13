export interface ModuleOptions {
  defaultColorMode?        : 'lite' | 'dark';
  usePreferredColorScheme? : boolean;

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
