import { loadImage } from '@resee-movies/utilities/dom/load-image';
import type { NormalizedFileDescriptorSource } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
import { getMediaAssetUrl, type MediaAssetTransformConfig } from '@resee-movies/utilities/resee/get-media-asset-url';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { fromTmdbImageSize } from '@resee-movies/utilities/tmdb/from-tmdb-image-size';
import { getTmdbImageCache } from '@resee-movies/utilities/tmdb/get-tmdb-image-cache';
import { getTmdbImageUrl } from '@resee-movies/utilities/tmdb/get-tmdb-image-url';
import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
import { type MaybeRefOrGetter, ref, type Ref, toRef, toValue, watch } from 'vue';


// /**
//  * Load an image asset. In client environments, where `Image` is available, this
//  * method will return a promise that resolves when the file is loaded (and decoded),
//  * and rejects on any error encountered. In server environments, the value of `src`
//  * is resolved immediately.
//  */
// export function loadImage(src: string) {
//   // If running in a server context, Image will not be defined.
//   try {
//     if (Image) { /* No-op */ }
//   }
//   catch {
//     return Promise.resolve(src);
//   }
//
//   return new Promise<string>((resolve, reject) => {
//     const img   = new Image();
//     img.src     = src;
//     img.onerror = (ev) => { console.log('OnError Called', ev); reject(ev) };
//     img.onload  = (...args) => { console.log('OnLoad Called', args); img.decode().then(() => resolve(src)) };
//   });
// }



export type LoadImageType = NormalizedFileDescriptorSource;

export type LoadImageOptions = {
  friendlyName?   : MaybeRefOrGetter<string | undefined>;
  placeholderSrc? : MaybeRefOrGetter<string>;
  errorSrc?       : MaybeRefOrGetter<string>;
  width?          : MaybeRefOrGetter<string | number>;
  type?           : MaybeRefOrGetter<LoadImageType>;
  reseeConfig?    : MaybeRefOrGetter<MediaAssetTransformConfig | undefined>;
  deferLoad?      : Ref<boolean>;
  onLoading?      : () => void;
  onLoad?         : (src: string | undefined) => void;
  onError?        : (err: unknown) => void;
};


/**
 * Exposes the {@link loadImage} utility as a set of reactive properties.
 */
export function useLoadImage(
  source: MaybeRefOrGetter<string | null | undefined>,
  config: LoadImageOptions = {},
) {
  const src       = ref<string>();
  const key       = ref<string>();
  const error     = ref<unknown>();
  const loading   = ref<boolean>(false);
  const bgLoading = ref<boolean>(false);

  watch(
    [
      toRef(source),
      toRef(config.friendlyName),
      toRef(config.placeholderSrc),
      toRef(config.errorSrc),
      toRef(config.width),
      toRef(config.reseeConfig),
      toRef(config.type),
      toRef(config.deferLoad),
    ],
    () => {
      const sourceUnwrapped = toValue(source);

      /*
       * If no src value has been provided, then there is nothing more that can
       * be done. Short-circuit here.
       */
      if (!isString(sourceUnwrapped) || sourceUnwrapped.trim() === '') {
        src.value   = toValue(config.errorSrc);
        key.value   = src.value;
        error.value = new Error('"src" is not defined');

        config.onError?.(error.value);
        return;
      }

      const loadType = toValue(config.type);
      const imgWidth = toValue(config.width);

      if (toValue(config.deferLoad)) {
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

      let targetSrc: string | undefined;
      let tempSrc: string | undefined;
      let promise: Promise<string> | undefined;

      // Load TMDB images using our nifty resolution caching setup.
      if (loadType === 'tmdb') {
        targetSrc    = getTmdbImageUrl(sourceUnwrapped, imgWidth);
        const result = getTmdbImageCache().getImage(targetSrc);

        if (isPromiseLike(result)) {
          tempSrc = result.placeholderUrl;
          promise = result;
        }
      }

      // Load a ReSee media asset.
      else if (loadType === 'resee') {
        const filename    = toValue(config.friendlyName);
        const reseeConfig = toValue(config.reseeConfig);
        const width       = fromTmdbImageSize(imgWidth, { originalIsUndefined: true });

        targetSrc = getMediaAssetUrl(sourceUnwrapped, filename, { width, format: 'webp', ...reseeConfig });
        promise   = loadImage(targetSrc);
      }

      // Anything else.
      else {
        targetSrc = sourceUnwrapped;
        promise   = loadImage(targetSrc);
      }


      // Time to start updating refs.
      // src: If there is a temp image to display, do so, but otherwise set
      //      the ref to the target value. The reason for this second bit is
      //      to keep away from hydration issues.

      src.value       = tempSrc ?? targetSrc;
      key.value       = tempSrc ?? sourceUnwrapped;
      loading.value   = !!promise && !tempSrc;
      bgLoading.value = !!promise && !!tempSrc;
      error.value     = undefined;

      if (!promise) {
        config.onLoad?.(src.value);
        return;
      }

      config.onLoading?.();

      promise.then(
        (loadedSrc) => {
          src.value       = loadedSrc;
          key.value       = sourceUnwrapped;
          loading.value   = false;
          bgLoading.value = false;
          error.value     = undefined;

          config.onLoad?.(src.value);
        },

        (e) => {
          src.value       = toValue(config.errorSrc) ?? toValue(config.placeholderSrc);
          key.value       = src.value;
          loading.value   = false;
          bgLoading.value = false;
          error.value     = e;

          config.onError?.(e);
        },
      );
    },
    { immediate: true },
  );

  return { src, key, error, loading, bgLoading };
}
