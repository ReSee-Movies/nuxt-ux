<template>
  <Card
    :is          = "props.is"
    :loading     = "isImgLoading || props.loading"
    :interactive = "props.interactive"
    :colorful    = "props.colorful"
    :beveled     = "props.beveled"
    :raised      = "props.raised"
    :bordered    = "props.bordered"
    :class       = "[
      'image',
      {
        glass : props.glassy && (!(imgHasError || isImgLoading || props.loading)),
        scale : props.scaleToParent,
      },
    ]"
  >
    <Icon
      v-if   = "props.defaultIcon && imgHasError"
      :name  = "props.defaultIcon"
      :size  = "props.iconSize"
      class  = "transition-opacity duration-300"
      :class = "{ 'opacity-0': isImgLoading || props.loading }"
    />

    <ImageBase
      :src         = "props.src"
      :type        = "props.type"
      :alt         = "props.alt"
      :width       = "props.width"
      :height      = "props.height"
      :aspect      = "props.aspect"
      :fit         = "props.fit"
      :loadStyle   = "props.loadStyle"
      class        = "transition-opacity duration-300"
      :class       = "{ 'opacity-0': isImgLoading || props.loading || imgHasError }"
      :aria-hidden = "imgHasError ? 'true' : 'false'"
      @loading     = "handleLoading"
      @load        = "handleLoaded"
      @error       = "handleError"
    />
  </Card>
</template>


<script lang="ts">
  import type { CardProps } from './Card.vue';
  import type { IconProps } from './Icon.vue';
  import type { ImageBaseProps } from './ImageBase.vue';

  export interface ImageProps extends ImageBaseProps, CardProps {
    defaultIcon?   : string;
    iconSize?      : IconProps['size'];
    glassy?        : boolean;
    scaleToParent? : boolean;
  }
</script>


<script setup lang="ts">
  import { ref } from 'vue';
  import Card from './Card.vue';
  import Icon from './Icon.vue';
  import ImageBase from './ImageBase.vue';

  const props = withDefaults(
    defineProps<ImageProps>(),
    {
      defaultIcon   : 'i-ph-image-thin',
      iconSize      : 'xl',
      glassy        : false,
      scaleToParent : true,
    },
  );

  const emits = defineEmits<{
    (e: 'loading'): void;
    (e: 'load', src: string | undefined): void;
    (e: 'error', err: unknown): void;
  }>();


  // Purposefully set this to true so there aren't
  // any content flashes as the image goes from
  // not loaded -> loading -> loaded. Instead, always
  // assume loading... at least its consistent.
  const isImgLoading = ref(true);

  const imgHasError = ref<unknown>(null);

  function handleLoading() {
    isImgLoading.value = true;
    emits('loading');
  }

  function handleLoaded(src: string | undefined) {
    isImgLoading.value = false;
    imgHasError.value  = null;

    emits('load', src);
  }

  function handleError(err: unknown) {
    isImgLoading.value = false;
    imgHasError.value  = err;

    emits('error', err);
  }
</script>


<style scoped>
  @layer components {
    .image {
      position  : relative;
      overflow  : clip;
      display   : block;
      max-width : fit-content;
    }

    .image.glass::after {
      content          : var(--zero-width-space);
      position         : absolute;
      inset            : 0;
      background-image : linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.15) 80%, transparent);
    }

    .image :deep(.icon) {
      color     : var(--color-global-background-accent);
      position  : absolute;
      top       : 50%;
      left      : 50%;
      transform : translateX(-50%) translateY(-50%);
    }

    .image.scale {
      max-width: unset;
    }

    .image.scale :deep(img) {
      min-width: 100%;
    }
  }
</style>
