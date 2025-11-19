<template>
  <div
    ref    = "container"
    :class = "['image', {
      loading  : imgLoading || imgBgLoading || props.showLoading,
      glass    : props.glassy,
      bordered : props.bordered,
      beveled  : props.beveled,
      raised   : props.raised,
    }]"
  >
    <Icon
      v-if         = "props.defaultIcon && (!imgSrc || imgError || imgLoading || props.showLoading)"
      :name        = "props.defaultIcon"
      :size        = "props.iconSize"
      :color-cycle = "imgLoading || props.showLoading"
    />

    <img
      :src     = "imgSrc"
      :alt     = "altText"
      :width   = "dimensions.width"
      :height  = "dimensions.height"
      :loading = "props.loading"
      class    = "transition-opacity duration-300"
      :class   = "[aspectRatioClass, objectFitClass, {
        'opacity-0': (!imgSrc || imgLoading)
      }]"
    >
  </div>
</template>


<script lang="ts">
  import type { ImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import type { AspectRatio } from '@resee-movies/utilities/numbers/get-aspect-ratio';
  import type { MediaAssetTransformConfig } from '@resee-movies/utilities/resee/get-media-asset-url';
  import type { TmdbImageSize } from '@resee-movies/utilities/tmdb/get-tmdb-image-url';
  import type { LoadImageType } from '../composables/use-load-image';
  import type { HTMLElementClassNames } from '../types';
  import type { IconProps } from './Icon.vue';

  export interface ImageProps {
    src             : ImageFileDescriptor | null | undefined;
    alt?            : string | null | ((error: unknown) => string);
    type?           : LoadImageType;
    width?          : TmdbImageSize | string | number;
    height?         : string | number;
    aspect?         : AspectRatio | 'auto';
    fit?            : MediaAssetTransformConfig['fit'];
    showLoading?    : boolean;
    defaultIcon?    : string;
    iconSize?       : IconProps['size'];
    loading?        : 'lazy' | 'eager';
    glassy?         : boolean;
    bordered?       : boolean;
    beveled?        : boolean;
    raised?         : boolean;
    overlayClasses? : HTMLElementClassNames;
  }

  export const AspectRatioClassNames = {
    '1/1'    : 'aspect-square',
    'square' : 'aspect-square',
    '2/3'    : 'aspect-poster',
    'poster' : 'aspect-poster',
    '4/5'    : 'aspect-tall',
    '16/9'   : 'aspect-video',
    'video'  : 'aspect-video',
  } as const;

  export const ObjectFitClassNames = {
    cover   : 'object-cover',
    outside : 'object-cover',
    contain : 'object-contain',
    inside  : 'object-contain',
  } as const;
</script>


<script setup lang="ts">
  import { normalizeImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import { getAspectRatio } from '@resee-movies/utilities/numbers/get-aspect-ratio';
  import { fromTmdbImageSize } from '@resee-movies/utilities/tmdb/from-tmdb-image-size';
  import { computed, ref } from 'vue';
  import { useLoadImage } from '../composables/use-load-image';
  import { useSharedIntersectionObserver } from '../composables/use-shared-intersection-observer';
  import Icon from './Icon.vue';

  const props = withDefaults(
    defineProps<ImageProps>(),
    {
      type           : undefined,
      alt            : '',
      width          : 'w185',
      height         : undefined,
      aspect         : undefined,
      fit            : 'cover',
      bgColor        : 'bg-black',
      showLoading    : false,
      defaultIcon    : 'i-ph-image-thin',
      iconClasses    : 'text-global-foreground-accent',
      iconSize       : 'xl',
      loading        : 'lazy',
      glassy         : false,
      bordered       : false,
      beveled        : false,
      raised         : false,
      overlayClasses : undefined,
    },
  );

  const deferLoad = ref(props.loading === 'lazy');
  const container = ref();


  /**
   * A `normalizedImageFileDescriptor` of the image source.
   */
  const normalizedSource = computed(() => {
    const result = normalizeImageFileDescriptor(props.src);

    if (props.type) {
      result.sourceType = props.type;
    }

    return result;
  });


  /**
   * The height and width of the image, if enough info is available to
   * figure it out (one of either an explicit height/width, and aspect
   * ratio).
   */
  const dimensions = computed(() => {
    let intWidth  = normalizedSource.value.width;
    let intHeight = normalizedSource.value.height;

    // Width and Height are being set as a pair - and only as a pair - so
    // that a solitary width or height value can be passed in to indicate
    // the desired resolution, without the other value (the native x or y
    // value of the file) messing things up.

    if (props.width || props.height) {
      intWidth  = fromTmdbImageSize(props.width);
      intHeight = fromTmdbImageSize(props.height);
    }

    if (!props.aspect || props.aspect === 'auto' || (intWidth && intHeight)) {
      return { width: intWidth, height: intHeight };
    }

    if (intHeight) {
      const aspect = getAspectRatio(intHeight, 'y', props.aspect);
      return { width: aspect.x, height: aspect.y };
    }

    if (intWidth) {
      const aspect = getAspectRatio(intWidth, 'x', props.aspect);
      return { width: aspect.x, height: aspect.y };
    }

    return { width: undefined, height: undefined };
  });


  /**
   * Implementation of `useLoadImage`.
   */
  const imgLoadInfo = useLoadImage(
    () => normalizedSource.value.identifier,
    {
      deferLoad    : deferLoad,
      type         : () => normalizedSource.value.sourceType,
      width        : () => props.width,
      friendlyName : () => normalizedSource.value.friendlyName,
      reseeConfig  : () => ({
        width  : dimensions.value.width,
        height : dimensions.value.height,
        fit    : props.fit,
      }),
    },
  );

  const {
    src       : imgSrc,
    loading   : imgLoading,
    bgLoading : imgBgLoading,
    error     : imgError,
  } = imgLoadInfo;

  /**
   * If deferred, wait until the container enters the viewport.
   */
  if (deferLoad.value) {
    useSharedIntersectionObserver(container, {
      once: true,

      onChange(isIntersecting) {
        if (isIntersecting) {
          deferLoad.value = false;
        }
      },
    });
  }


  /**
   * CSS class name that defines the image aspect ratio.
   */
  const aspectRatioClass = computed(() => {
    return !props.aspect || props.aspect === 'auto'
      ? undefined
      : AspectRatioClassNames[props.aspect];
  });


  /**
   * CSS class name that defines the desired fit of the image within its
   * parent container.
   */
  const objectFitClass = computed(() => {
    return !props.fit
      ? undefined
      : ObjectFitClassNames[props.fit];
  });


  /**
   * Alternate image text.
   */
  const altText = computed(() => {
    return typeof props.alt === 'function'
      ? props.alt(imgError.value)
      : (props.alt ?? normalizedSource.value.description ?? '');
  });
</script>


<style scoped>
  @reference "tailwindcss";

  .image {
    background-color : white;
    position         : relative;
    overflow         : clip;
    width            : fit-content;

    @variant dark {
      background-color: black;
    }

    &.bordered {
      border: solid 2px var(--color-global-background-accent);
    }

    &.beveled {
      border-top-right-radius   : var(--radius-xl);
      border-bottom-left-radius : var(--radius-xl);
    }

    &.raised {
      box-shadow: var(--shadow-heavy);
    }
  }

  .image.glass::after {
    content          : var(--zero-width-space);
    position         : absolute;
    inset            : 0;
    background-image : linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.15) 80%, transparent);
  }

  .image .icon {
    color     : var(--color-global-background-accent);
    position  : absolute;
    top       : 50%;
    left      : 50%;
    transform : translateX(-50%) translateY(-50%);
  }
</style>
