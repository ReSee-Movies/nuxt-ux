<template>
  <div
    :class = "['image', {
      loading  : isImgLoading || props.showLoading,
      glass    : props.glassy && (!(imgHasError || isImgLoading || props.showLoading)),
      bordered : props.bordered,
      beveled  : props.beveled,
      raised   : props.raised,
    }]"
  >
    <Icon
      v-if     = "props.defaultIcon && imgHasError"
      :name    = "props.defaultIcon"
      :size    = "props.iconSize"
      class    = "transition-opacity duration-300"
      :class   = "{
        'opacity-0': isImgLoading || props.showLoading
      }"
    />

    <ImageBase
      :src          = "props.src"
      :type         = "props.type"
      :alt          = "props.alt"
      :width        = "props.width"
      :height       = "props.height"
      :aspect       = "props.aspect"
      :fit          = "props.fit"
      :loading      = "props.loading"
      :show-loading = "props.showLoading"
      @loading      = "(state) => isImgLoading = state"
      @load         = "() => imgHasError = null"
      @error        = "(err) => imgHasError = err"
    />
  </div>
</template>


<script lang="ts">
  import type { IconProps } from './Icon.vue';
  import type { ImageBaseProps } from './ImageBase.vue';

  export interface ImageProps extends ImageBaseProps {
    defaultIcon? : string;
    iconSize?    : IconProps['size'];
    glassy?      : boolean;
    bordered?    : boolean;
    beveled?     : boolean;
    raised?      : boolean;
  }
</script>


<script setup lang="ts">
  import { ref } from 'vue';
  import Icon from './Icon.vue';
  import ImageBase from './ImageBase.vue';

  const props = withDefaults(
    defineProps<ImageProps>(),
    {
      defaultIcon    : 'i-ph-image-thin',
      iconSize       : 'xl',
      glassy         : false,
      bordered       : false,
      beveled        : false,
      raised         : false,
    },
  );

  const isImgLoading = ref(true);
  const imgHasError  = ref<unknown>(null);


</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    @keyframes color-pulse {
      0% { background-color: var(--bg-color-1); }
      50% { background-color: var(--bg-color-2); }
      100% { background-color: var(--bg-color-1); }
    }

    .image {
      --bg-color-1: rgb(255, 255, 255);
      --bg-color-2: rgb(240, 240, 240);

      background-color : var(--bg-color-1);
      position         : relative;
      overflow         : clip;
      width            : 100%;
      max-width        : fit-content;

      @variant dark {
        --bg-color-1: rgb(0, 0, 0);
        --bg-color-2: rgb(15, 15, 15);
      }

      &.loading {
        animation-name            : color-pulse;
        animation-duration        : 2.5s;
        animation-timing-function : ease-out;
        animation-fill-mode       : both;
        animation-iteration-count : infinite;
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

    .image :deep(.icon) {
      color     : var(--color-global-background-accent);
      position  : absolute;
      top       : 50%;
      left      : 50%;
      transform : translateX(-50%) translateY(-50%);
    }
  }
</style>
