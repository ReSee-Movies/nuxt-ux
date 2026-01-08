<template>
  <div class="image-backdrop">
    <div :class="['background', { 'fixed-position': props.fixedPosition }, props.maskPreset, props.backgroundClass]">
      <slot name="background">
        <Transition name="fade" mode="out-in">
          <LazyImage
            v-if    = "props.src && !Array.isArray(props.src)"
            v-bind  = "props.singleImageOptions"
            :src    = "props.src"
            :width  = "props.singleImageOptions?.width ?? 'original'"
            :aspect = "props.singleImageOptions?.aspect ?? 'video'"
          />

          <LazyImageTiler
            v-else-if = "Array.isArray(props.src)"
            v-bind    = "props.multiImageOptions"
            :images   = "props.src"
          />

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
    motionArt?          : boolean;
    maskPreset?         : ImageMaskPreset | ImageMaskPreset[];
    singleImageOptions? : SingleImageProps;
    multiImageOptions?  : MultiImageProps;
    motionArtOptions?   : MotionArtProps;
    backgroundClass?    : HTMLElementClassNames;
  }
</script>


<script setup lang="ts">
  import LazyImage from './Image.vue';
  import LazyImageTiler from './ImageTiler.vue';
  import LazyMotionArt from './MotionArt.vue';

  const props = withDefaults(
    defineProps<ImageBackdropProps>(),
    {
      src                : undefined,
      fixedPosition      : true,
      motionArt          : true,
      maskPreset         : undefined,
      singleImageOptions : undefined,
      multiImageOptions  : undefined,
    },
  );
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
    0%   { left: -20px; right: -20px }
    100% { left: 0;     right: 0 }
  }

  @keyframes fade-image {
      0% { opacity: 1 }
    100% { opacity: 0.7 }
  }

  .image-backdrop .background {
    position : absolute;
    z-index  : 0;
    top      : 0;
    left     : 0;
    right    : 0;
    overflow : clip;
  }

  .image-backdrop .background.fixed-position {
    position: fixed;

    &:has(.image) {
      left  : -20px;
      right : -20px;
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
