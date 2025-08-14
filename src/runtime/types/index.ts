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


/**
 * The shape of object that can be passed into an element's dynamic `:class=""` prop.
 */
export type HTMLElementClassNames
  = string
  | HTMLElementClassNames[]
  | Record<string, boolean>
  | null
  | undefined;

/**
 * A string-type, with some suggestions.
 */
export type HintedString<T> = string | T;
