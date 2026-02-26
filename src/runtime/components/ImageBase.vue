<template>
  <img
    ref      = "container"
    :src     = "imageData.src"
    :alt     = "altText"
    :width   = "dimensions.width"
    :height  = "dimensions.height"
    :loading = "props.loadStyle"
    :class   = "[aspectRatioClass, objectFitClass]"
  >
</template>


<script lang="ts">
  import type {
    ImageFileDescriptor,
    NormalizedFileDescriptorSource,
  } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import type { AspectRatio } from '@resee-movies/utilities/numbers/get-aspect-ratio';
  import type { MediaAssetTransformConfig } from '@resee-movies/utilities/resee/get-media-asset-url';
  import type { TmdbImageSize } from '@resee-movies/utilities/tmdb/get-tmdb-image-url';

  export interface ImageBaseProps {
    src        : ImageFileDescriptor | null | undefined;
    alt?       : string | null | ((error: unknown) => string);
    type?      : NormalizedFileDescriptorSource;
    width?     : TmdbImageSize | string | number;
    height?    : string | number;
    aspect?    : AspectRatio | 'auto';
    fit?       : MediaAssetTransformConfig['fit'];
    loadStyle? : 'lazy' | 'eager';
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
  import { useImageStore } from '../stores/use-image-store';
  import { useSharedIntersectionObserver } from '../composables/use-shared-intersection-observer';

  const props = withDefaults(
    defineProps<ImageBaseProps>(),
    {
      type        : undefined,
      alt         : '',
      width       : 'w185',
      height      : undefined,
      aspect      : undefined,
      fit         : 'cover',
      showLoading : false,
      loading     : 'lazy',
    },
  );

  const emits = defineEmits<{
    (e: 'loading'): void;
    (e: 'load', src: string | undefined, key: string | undefined): void;
    (e: 'error', err: unknown): void;
  }>();

  const deferLoad = ref(props.loadStyle === 'lazy');
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
      intWidth  = fromTmdbImageSize(props.width, { originalIsUndefined: true });
      intHeight = fromTmdbImageSize(props.height, { originalIsUndefined: true });
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
   * Implementation of `useImageStore`.
   */
  const imageData = useImageStore().loadImage(
    () => normalizedSource.value.identifier,
    {
      deferLoad    : deferLoad,
      type         : () => normalizedSource.value.sourceType,
      width        : () => props.width,
      friendlyName : () => normalizedSource.value.friendlyName,
      onLoading    : () => emits('loading'),
      onLoad       : (src, key) => emits('load', src, key),
      onError      : (err) => emits('error', err),
      reseeConfig  : () => ({
        width  : dimensions.value.width,
        height : dimensions.value.height,
        fit    : props.fit,
      }),
    },
  );


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
      ? props.alt(imageData.error)
      : (props.alt ?? normalizedSource.value.description ?? '');
  });
</script>
