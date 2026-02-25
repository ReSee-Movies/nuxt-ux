<template>
  <div class="image-backdrop">
    <div
      :class="[
        'background',
        props.maskPreset,
        props.backgroundClass,
        {
          'fixed-position'      : props.fixedPosition && !props.scaleToForeground,
          'scale-to-foreground' : props.scaleToForeground,
        },
      ]"
    >
      <slot name="background">
        <Transition name="fade" mode="out-in">
          <LazyImage
            v-if             = "props.src && !Array.isArray(props.src)"
            v-bind           = "props.singleImageOptions"
            :src             = "props.src"
            :width           = "props.singleImageOptions?.width ?? 'original'"
            :aspect          = "props.singleImageOptions?.aspect ?? 'video'"
            :scale-to-parent = "props.scaleToForeground ? 'cover' : undefined"
            :key             = "transitionKey"
          />

          <div v-else-if="Array.isArray(props.src)">
            <ClientOnly >
              <LazyImageTiler
                v-bind  = "props.multiImageOptions"
                :images = "props.src"
              />
            </ClientOnly>
          </div>

          <LazyMotionArt
            v-else-if = "(!props.src && props.motionArt)"
            v-bind    = "props.motionArtOptions"
            class     = "aspect-video sm:aspect-auto sm:h-screen"
          />
        </Transition>
      </slot>
    </div>

    <div class="foreground">
      <slot name="default" />
    </div>
  </div>
</template>


<script lang="ts">
  import type { ImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import type { HTMLElementClassNames, ImageMaskPreset } from '../types';
  import type { ImageProps } from './Image.vue';
  import type { ImageBaseProps } from './ImageBase.vue';
  import type { ImageTilerProps } from './ImageTiler.vue';
  import type { MotionArtProps } from './MotionArt.vue';

  export type SingleImageProps
    = Omit<ImageBaseProps, 'src' | 'alt' | 'loadStyle'>
    & Pick<ImageProps, 'defaultIcon' | 'iconSize'>;

  export type MultiImageProps = Omit<ImageTilerProps, 'images' | 'maskPreset'>;

  export interface ImageBackdropProps {
    src?                : ImageFileDescriptor | ImageFileDescriptor[] | null | undefined;
    fixedPosition?      : boolean;
    scaleToForeground?  : boolean;
    motionArt?          : boolean;
    maskPreset?         : ImageMaskPreset | ImageMaskPreset[];
    singleImageOptions? : SingleImageProps;
    multiImageOptions?  : MultiImageProps;
    motionArtOptions?   : MotionArtProps;
    backgroundClass?    : HTMLElementClassNames;
  }
</script>


<script setup lang="ts">
  import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import { computed } from 'vue';
  import LazyImage from './Image.vue';
  import LazyImageTiler from './ImageTiler.vue';
  import LazyMotionArt from './MotionArt.vue';

  const props = withDefaults(
    defineProps<ImageBackdropProps>(),
    {
      src                : undefined,
      fixedPosition      : true,
      scaleToForeground  : false,
      motionArt          : true,
      maskPreset         : undefined,
      singleImageOptions : undefined,
      multiImageOptions  : undefined,
    },
  );

  const transitionKey = computed(() => {
    if (Array.isArray(props.src)) {
      return 'tiler';
    }

    if (isString(props.src)) {
      return props.src;
    }

    if (isObjectLike(props.src)) {
      if ('id' in props.src) {
        return props.src.id ?? undefined;
      }

      if ('identifier' in props.src) {
        return props.src.identifier ?? undefined;
      }

      if ('filename' in props.src) {
        return props.src.filename ?? undefined;
      }
    }

    return undefined;
  });
</script>


<style scoped>
  @reference "tailwindcss";

  .image-backdrop {
    position: relative;
  }

  .image-backdrop .foreground {
    position : relative;
    z-index  : 1;
  }

  @keyframes shrink-image {
    0%   {
      left  : var(--offset-left-overflow);
      right : var(--offset-right-overflow);
    }

    100% {
      left  : var(--offset-left-base);
      right : var(--offset-right-base);
    }
  }

  @keyframes fade-image {
      0% { opacity: 1 }
    100% { opacity: 0.7 }
  }

  .image-backdrop .background {
    --offset-left-base  : 0;
    --offset-right-base : var(--p-scrollbar-width, 0);

    position : absolute;
    z-index  : 0;
    top      : 0;
    left     : var(--offset-left-base);
    right    : var(--offset-right-base);
    overflow : clip;
  }

  .image-backdrop .background.scale-to-foreground {
    bottom         : 0;
    container-type : size;
  }

  .image-backdrop .background.fixed-position {
    position: fixed;

    &:has(.image) {
      --offset-left-overflow  : -20px;
      --offset-right-overflow : calc(-20px + var(--p-scrollbar-width));

      left  : var(--offset-left-overflow);
      right : var(--offset-right-overflow);
    }

    @variant supports-animation-timeline {
      &:has(.image) {
        animation : shrink-image linear forwards, fade-image linear forwards;
      }

      &:has(.tiler) {
        animation: fade-image linear forwards;
      }

      &:has(.image, .tiler) {
        animation-timeline : scroll();
        animation-range    : 0 calc(calc(100vw * 0.5625) - 110px);

        @variant sm {
          animation-range: 0 150px;
        }
      }
    }
  }
</style>
