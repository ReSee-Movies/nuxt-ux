<template>
  <div class="image-backdrop" :style="offsetStyles">
    <div :class="['background', props.maskPreset]">
      <slot name="background">
        <Transition name="fade" mode="out-in">
          <LazyImage
            v-if    = "props.src && !Array.isArray(props.src)"
            :src    = "props.src"
            :type   = "props.singleImage?.type"
            :width  = "props.singleImage?.width ?? 'original'"
            :height = "props.singleImage?.height"
            :aspect = "props.singleImage?.aspect ?? 'video'"
            :fit    = "props.singleImage?.fit"
          />

          <LazyImageTiler
            v-else-if      = "Array.isArray(props.src)"
            :images        = "props.src"
            :play          = "props.multiImage?.play"
            :grid-settings = "props.multiImage?.gridSettings"
            :turnover-rate = "props.multiImage?.turnoverRate"
            :switch-time   = "props.multiImage?.switchTime"
            :switch-delay  = "props.multiImage?.switchDelay"
            :image-class   = "props.multiImage?.imageClass"
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
  import type { ImageBaseProps } from './ImageBase.vue';
  import type { ImageTilerProps } from './ImageTiler.vue';

  export type SingleImageProps = Omit<ImageBaseProps, 'src' | 'alt' | 'loadStyle'>;

  export type MultiImageProps = Omit<ImageTilerProps, 'images' | 'maskPreset'>;

  export interface ImageBackdropProps {
    src?          : ImageFileDescriptor | ImageFileDescriptor[] | null | undefined;
    behindHeader? : boolean;
    maskPreset?   : ImageMaskPreset | ImageMaskPreset[];
    singleImage?  : SingleImageProps;
    multiImage?   : MultiImageProps;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import { useGlobalHeaderState } from '../composables/use-global-header-state';
  import LazyImage from './Image.vue';
  import LazyImageTiler from './ImageTiler.vue';

  const props = withDefaults(
    defineProps<ImageBackdropProps>(),
    {
      src          : undefined,
      behindHeader : true,
      maskPreset   : undefined,
      singleImage  : undefined,
      multiImage   : undefined,
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
    }
  }
</style>
