import { loadImage } from '@resee-movies/utilities/dom/load-image';
import { getImageUrl } from '@resee-movies/utilities/images/get-image-url';
import type {
  ImageFileDescriptor,
  NormalizedFileDescriptorSource,
} from '@resee-movies/utilities/images/normalize-image-file-descriptor';
import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
import {
  type DirectusFileDescriptor,
  getMediaAssetUrl,
  type GetMediaAssetUrlOptions,
  type MediaAssetTransformConfig,
} from '@resee-movies/utilities/resee/get-media-asset-url';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { fromTmdbImageSize } from '@resee-movies/utilities/tmdb/from-tmdb-image-size';
import { TmdbImageCache } from '@resee-movies/utilities/tmdb/get-tmdb-image-cache';
import {
  getTmdbImageUrl,
  type GetTmdbImageUrlOptions,
  type TmdbFileDescriptor,
  type TmdbImageSize,
} from '@resee-movies/utilities/tmdb/get-tmdb-image-url';
import { defineStore } from 'pinia';
import { type MaybeRefOrGetter, type Reactive, type Ref, shallowReactive, toRef, toValue, watch } from 'vue';
import type { ReseeUxPublicRuntimeConfig } from '../types';
import { useReseeUxStore } from './use-resee-ux-store';


export type LoadImageOptions = {
  friendlyName?   : MaybeRefOrGetter<string | undefined>;
  placeholderSrc? : MaybeRefOrGetter<string>;
  errorSrc?       : MaybeRefOrGetter<string>;
  width?          : MaybeRefOrGetter<string | number>;
  type?           : MaybeRefOrGetter<NormalizedFileDescriptorSource>;
  reseeConfig?    : MaybeRefOrGetter<MediaAssetTransformConfig | undefined>;
  deferLoad?      : Ref<boolean>;
  onLoading?      : () => void;
  onBgLoading?    : () => void;
  onLoad?         : (src: string | undefined, key: string | undefined) => void;
  onError?        : (err: unknown) => void;
};

export type LoadImageState = Reactive<{
  src       : string | undefined;
  key       : string | undefined;
  error     : unknown;
  loading   : boolean;
  bgLoading : boolean;
}>;

type LoadImageContext = {
  state  : LoadImageState;
  cache  : TmdbImageCache;
  config : ReseeUxPublicRuntimeConfig;
};

/**
 * The Image store provides methods for generating image URLs, and/or intelligently
 * loading image files into the browser.
 */
export const useImageStore = defineStore('image', () => {
  const cache = new TmdbImageCache();

  const {
    config,
  } = useReseeUxStore();

  /**
   * Loads an image resource, and provides a reactive object which conveys
   * the status of the loading process. For TMDB images, an alternate might
   * be provided while the original request completes in the background.
   */
  function loadImageFunction(
    source  : MaybeRefOrGetter<string | null | undefined>,
    options : LoadImageOptions,
  ) {
    const state = shallowReactive<LoadImageState>({
      src       : undefined,
      key       : undefined,
      error     : undefined,
      loading   : false,
      bgLoading : false,
    });

    watch(
      [
        toRef(source),
        toRef(options.friendlyName),
        toRef(options.placeholderSrc),
        toRef(options.errorSrc),
        toRef(options.width),
        toRef(options.reseeConfig),
        toRef(options.type),
        toRef(options.deferLoad),
      ],
      () => {
        handleImageLoad(source, options, { state, cache, config });
      },
      { immediate: true },
    );

    return state;
  }

  /**
   * A wrapper for {@link getImageUrl} that preconfigures the ReSee and TMDB
   * base paths with preconfigured values.
   */
  function getImageUrlFunction(descriptor: ImageFileDescriptor | null | undefined) {
    return getImageUrl(descriptor, {
      reseeBaseUrl : config.reseeImageBaseUrl,
      tmdbBaseUrl  : config.tmdbImageBaseUrl,
    });
  }

  /**
   * A wrapper for {@link getMediaAssetUrl} that preconfigures the ReSee base
   * path with a preconfigured value.
   */
  function getMediaAssetUrlFunction(
    fileId   : string,
    options? : Omit<GetMediaAssetUrlOptions, 'baseUrl'>,
  ): string;

  function getMediaAssetUrlFunction(
    fileId   : DirectusFileDescriptor,
    options? : Omit<GetMediaAssetUrlOptions, 'baseUrl'>
  ): string;

  function getMediaAssetUrlFunction(
    fileId    : string,
    fileName? : string | null | undefined,
    options?  : Omit<GetMediaAssetUrlOptions, 'baseUrl'>,
  ): string;

  function getMediaAssetUrlFunction(
    fileId      : string | DirectusFileDescriptor,
    nameOrOpts? : string | Omit<GetMediaAssetUrlOptions, 'baseUrl'> | null | undefined,
    options?    : Omit<GetMediaAssetUrlOptions, 'baseUrl'>,
  ) {
    // @ts-expect-error - not bothering with the discriminated union of the fileId right now
    return getMediaAssetUrl(fileId, nameOrOpts, { ...options, baseUrl: config.tmdbImageBaseUrl });
  }

  /**
   * A wrapper for {@link getMediaAssetUrl} that preconfigures the ReSee base
   * path with a preconfigured value.
   */
  function getTmdbImageUrlFunction(
    file  : TmdbFileDescriptor | string | null | undefined,
    size? : TmdbImageSize,
    opts? : Omit<GetTmdbImageUrlOptions, 'baseUrl'>,
  ) {
    return getTmdbImageUrl(file, size, { ...opts, baseUrl: config.tmdbImageBaseUrl });
  }

  return {
    loadImage        : loadImageFunction,
    getImageUrl      : getImageUrlFunction,
    getMediaAssetUrl : getMediaAssetUrlFunction,
    getTmdbImageUrl  : getTmdbImageUrlFunction,
  };
});


function handleImageLoad(
  source  : MaybeRefOrGetter<string | null | undefined>,
  options : LoadImageOptions,
  context : LoadImageContext,
) {
  const rawSource = toValue(source);

  /*
   * If no src value has been provided, then there is nothing more that can
   * be done. Short-circuit here.
   */
  if (!isString(rawSource, { withContent: true })) {
    context.state.src   = toValue(options.errorSrc);
    context.state.key   = context.state.src;
    context.state.error = new Error('"src" is not defined');

    options.onError?.(context.state.error);
    return;
  }

  const loadType = toValue(options.type);
  const imgWidth = toValue(options.width);

  if (toValue(options.deferLoad)) {
    return;
  }

  // Any one of three possibilities is handled below: the image src references
  // something from TMDB, the image src references something from ReSee, or the
  // image src is something "other". In all instances, the basic approach is to
  // first put together a complete URL (as needed), and then determine how to go
  // about loading the image file at that URL.

  // For ReSee and "other" URLs, this is pretty straight-forward. TMDB images,
  // however, we have the idea of a "background load".

  // A "background load" means that we're trying to get a higher resolution
  // version of an image that we already have. The lower-res version is going
  // to be served immediately - its "loaded" - while the higher-res version
  // is pulled in the background. The value of the src ref will be updated when
  // that load completes.

  let targetSrc : string | undefined;

  switch(loadType) {
    case 'tmdb':
      targetSrc = getTmdbImageUrl(rawSource, imgWidth, { baseUrl: context.config.tmdbImageBaseUrl });
      break;

    case 'resee':
      const filename    = toValue(options.friendlyName);
      const reseeConfig = toValue(options.reseeConfig);
      const width       = fromTmdbImageSize(imgWidth, { originalIsUndefined: true });

      targetSrc = getMediaAssetUrl(rawSource, filename, {
        width   : width,
        format  : 'webp',
        baseUrl : context.config.reseeImageBaseUrl,

        ...reseeConfig,
      });
      break;

    default:
      targetSrc = rawSource;
      break;
  }

  // If handling SSR, we don't need to go any further and try to actually load
  // the image.
  if (import.meta.server) {
    context.state.src = targetSrc;
    context.state.key = context.state.src;

    options.onLoad?.(context.state.src, context.state.key);
    return;
  }

  let tempSrc : string | undefined;
  let promise : Promise<string> | undefined;

  switch (loadType) {
    case 'tmdb':
      const cachedValue = context.cache.getImage(targetSrc, { baseUrl: context.config.tmdbImageBaseUrl });

      if (isPromiseLike(cachedValue)) {
        tempSrc = cachedValue.placeholderUrl;
        promise = cachedValue;
      }
      break;

    default:
      promise = loadImage(targetSrc);
      break;
  }

  // Time to start updating refs.
  // src: If there is a temp image to display, do so, but otherwise set
  //      the ref to the target value. The reason for this second bit is
  //      to keep away from hydration issues.

  context.state.src       = tempSrc ?? targetSrc;
  context.state.key       = tempSrc ?? rawSource;
  context.state.loading   = !!promise && !tempSrc;
  context.state.bgLoading = !!promise && !!tempSrc;
  context.state.error     = undefined;

  if (!promise) {
    options.onLoad?.(context.state.src, context.state.key);
    return;
  }

  if (context.state.bgLoading) {
    options.onBgLoading?.();
    options.onLoad?.(context.state.src, context.state.key);
  }
  else {
    options.onLoading?.();
  }

  promise.then(
    (loadedSrc) => {
      context.state.src       = loadedSrc;
      context.state.key       = rawSource;
      context.state.loading   = false;
      context.state.bgLoading = false;
      context.state.error     = undefined;

      options.onLoad?.(context.state.src, context.state.key);
    },

    (e) => {
      context.state.src       = toValue(options.errorSrc) ?? toValue(options.placeholderSrc);
      context.state.key       = context.state.src;
      context.state.loading   = false;
      context.state.bgLoading = false;
      context.state.error     = e;

      options.onError?.(e);
    },
  );
}
