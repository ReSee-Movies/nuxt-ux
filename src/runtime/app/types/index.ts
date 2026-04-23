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

/**
 * Creates a union of dot.separated.value strings that describes all the keys
 * in a nested object structure.
 */
export type ExtractKeys<T>
  = T extends object
    ? {
        [K in keyof T & string]:
          | K
          | (T[K] extends object ? `${ K }.${ ExtractKeys<T[K]> }` : K)
      }[keyof T & string]
    : never;

/**
 * A variant of {@link ExtractKeys} which creates a dot.separated.value union of
 * strings that describe all the keys in a nested object structure that do not
 * directly reference the structural `objects` themselves.
 */
export type ExtractLeafKeys<T>
  = T extends object
    ? {
        [K in keyof T & string]: (T[K] extends object ? `${ K }.${ ExtractLeafKeys<T[K]> }` : K)
      }[keyof T & string]
    : never;

/**
 * Given a dot.separated.value string, and a nested object, this will uncover the
 * type to which the string key points.
 */
export type ExtractKeyValue<T, S extends string>
  = T extends object
    ? S extends `${ infer S1 }.${ infer S2 }`
      ? (
          S1 extends keyof T
            ? ExtractKeyValue<T[S1], S2>
            : never
        )
      : (
          S extends keyof T
            ? T[S]
            : never
        )
    : never;
