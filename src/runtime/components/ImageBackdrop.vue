<template>
  <div class="image-backdrop" :style="offsetStyles">
    <div :class="['background', props.maskPreset]">
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
            class     = "bg-global-background"
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
  import type { ImageMaskPreset } from '../types';
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
    behindHeader?       : boolean;
    motionArt?          : boolean;
    maskPreset?         : ImageMaskPreset | ImageMaskPreset[];
    singleImageOptions? : SingleImageProps;
    multiImageOptions?  : MultiImageProps;
    motionArtOptions?   : MotionArtProps;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import { useGlobalHeaderState } from '../composables/use-global-header-state';
  import LazyImage from './Image.vue';
  import LazyImageTiler from './ImageTiler.vue';
  import LazyMotionArt from './MotionArt.vue';

  const props = withDefaults(
    defineProps<ImageBackdropProps>(),
    {
      src                : undefined,
      behindHeader       : true,
      motionArt          : true,
      motionArtOnError   : false,
      maskPreset         : undefined,
      singleImageOptions : undefined,
      multiImageOptions  : undefined,
    },
  );

  const headerState = useGlobalHeaderState();

  const offsetStyles = computed(() => {
    return props.behindHeader ? headerState.offsetFromHeaderStyles.value : undefined;
  });

  const headerOffset = computed(() => {
    return props.behindHeader ? `0px` : `${ headerState.headerHeight.value }px`;
  });
</script>


<style scoped>
  .image-backdrop {
    position: relative;

    .foreground {
      position : relative;
      z-index  : 1;
    }

    .background {
      position   : absolute;
      z-index    : 0;
      top        : 0;
      width      : 100%;
      max-height : calc(99vh - v-bind(headerOffset));
      overflow   : clip;
    }
  }
</style>
