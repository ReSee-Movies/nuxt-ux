import { useNuxtApp } from '#imports';
import { loadImage } from '@resee-movies/utilities/dom/load-image';
import type { NormalizedFileDescriptorSource } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
import { type MediaAssetTransformConfig, getMediaAssetUrl } from '@resee-movies/utilities/resee/get-media-asset-url';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { fromTmdbImageSize } from '@resee-movies/utilities/tmdb/from-tmdb-image-size';
import { getTmdbImageCache } from '@resee-movies/utilities/tmdb/get-tmdb-image-cache';
import { getTmdbImageUrl } from '@resee-movies/utilities/tmdb/get-tmdb-image-url';
import { toTmdbImageSize } from '@resee-movies/utilities/tmdb/to-tmdb-image-size';
import { type MaybeRefOrGetter, ref, type Ref, toRef, toValue, watch } from 'vue';


export type LoadImageType = NormalizedFileDescriptorSource;

export type LoadImageOptions = {
  friendlyName?   : MaybeRefOrGetter<string | undefined>;
  placeholderSrc? : MaybeRefOrGetter<string>;
  errorSrc?       : MaybeRefOrGetter<string>;
  width?          : MaybeRefOrGetter<string | number>;
  type?           : MaybeRefOrGetter<LoadImageType>;
  reseeConfig?    : MaybeRefOrGetter<MediaAssetTransformConfig | undefined>;
  deferLoad?      : Ref<boolean>;
};


/**
 * Exposes the {@link loadImage} utility as a set of reactive properties.
 */
export function useLoadImage(
  source: MaybeRefOrGetter<string | null | undefined>,
  config: LoadImageOptions = {},
) {
  const nuxtApp   = useNuxtApp();
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
        return;
      }


      const loadType = toValue(config.type);
      const imgWidth = toValue(config.width);

      /*
       * When ran server-side, image sources will be returned as-is (there is no Image
       * class, and no point in actually trying to fetch the file). Not returning the
       * same source during client hydration will result in mismatch errors.
       */
      if (import.meta.server || nuxtApp.isHydrating) {
        switch (loadType) {
          case 'tmdb': {
            src.value = getTmdbImageUrl(sourceUnwrapped, imgWidth ? toTmdbImageSize(imgWidth) : undefined);
            break;
          }
          case 'resee': {
            const filename    = toValue(config.friendlyName);
            const reseeConfig = toValue(config.reseeConfig);
            const width       = fromTmdbImageSize(imgWidth, { originalIsUndefined: true });

            src.value = getMediaAssetUrl(sourceUnwrapped, filename, { width, format: 'webp', ...reseeConfig });
            break;
          }
          default: {
            src.value = sourceUnwrapped;
          }
        }

        key.value = sourceUnwrapped;
        return;
      }


      if (toValue(config.deferLoad)) {
        return;
      }


      let pendingSource: string | undefined;
      let pendingLoader: string | Promise<string> | undefined;

      // Load TMDB images using our nifty resolution caching setup.
      if (loadType === 'tmdb') {
        const result  = getTmdbImageCache().getImage(sourceUnwrapped, imgWidth);
        pendingSource = isString(result) ? undefined : result.placeholderUrl;
        pendingLoader = result;
      }

      // Load a ReSee media asset.
      else if (loadType === 'resee') {
        const filename    = toValue(config.friendlyName);
        const reseeConfig = toValue(config.reseeConfig);
        const width       = fromTmdbImageSize(imgWidth, { originalIsUndefined: true });

        pendingLoader = loadImage(
          getMediaAssetUrl(sourceUnwrapped, filename, { width, format: 'webp', ...reseeConfig }),
        );
      }

      // Anything else.
      else {
        pendingLoader = loadImage(sourceUnwrapped);
      }


      // A string was returned immediately, we might be running server-side
      // or the requested image has already been loaded.
      if (isString(pendingLoader)) {
        src.value       = pendingLoader;
        key.value       = sourceUnwrapped;
        loading.value   = false;
        bgLoading.value = false;
        error.value     = undefined;
        return;
      }


      // If a promise was provided, it needs to be waited on.

      // A "background load" indicates that we're trying to get a higher resolution
      // version of an image that we already have. The lower-res version is going
      // to be served immediately - its "loaded" - while the higher-res version
      // is pulled in the background. The value of the src ref will be updated when
      // that load completes.

      src.value       = pendingSource ?? toValue(config.placeholderSrc) ?? src.value;
      key.value       = pendingSource ? sourceUnwrapped : undefined;
      loading.value   = !pendingSource;
      bgLoading.value = !!pendingSource;


      pendingLoader.then(
        (loadedSrc) => {
          src.value       = loadedSrc;
          key.value       = sourceUnwrapped;
          loading.value   = false;
          bgLoading.value = false;
          error.value     = undefined;
        },

        (e) => {
          src.value       = toValue(config.errorSrc) ?? toValue(config.placeholderSrc);
          key.value       = src.value;
          loading.value   = false;
          bgLoading.value = false;
          error.value     = e;
        },
      );
    },
    { immediate: true },
  );

  return { src, key, error, loading, bgLoading };
}
