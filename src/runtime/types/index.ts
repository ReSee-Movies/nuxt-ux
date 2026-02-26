export interface ModuleOptions {
  defaultColorMode?        : 'lite' | 'dark';
  usePreferredColorScheme? : boolean;
  componentPrefix?         : string;
  reseeImageBaseUrl?       : string;
  tmdbImageBaseUrl?        : string;

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

/**
 * Describes the intent - and therefore styling - of elements like message blocks,
 * toast notifications, tags, and chips.
 */
export type StatusLevel = 'info' | 'help' | 'success' | 'warn' | 'error';

/**
 * Additional descriptors beyond what {@link StatusLevel} provides. As these are
 * not descriptive of intent, they exist separately so the two can be used
 * separately.
 */
export type StyleStatusLevel = 'default' | 'inverted' | StatusLevel;

/**
 * CSS classnames that apply pre-configured gradients over their target
 * element. As the type's name suggest, these are intended to be used
 * with images.
 */
export type ImageMaskPreset
  = 'image-mask-washout'
    | 'image-mask-gradient-washout'
    | 'image-mask-gradient-washout-lite'
    | 'image-mask-gradient-opacity'
    | 'image-mask-hero';
