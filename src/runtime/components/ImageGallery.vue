<template>
  <PrimeGalleria
    v-model:active-index  = "activeIndex"
    :value                = "normalizedSources"
    :pt                   = "passThrough"
    :num-visible          = "6"
    :show-item-navigators = "true"
    :show-thumbnails      = "showThumbnails"
  >
    <template #item="slotProps">
      <ImageBase :src="slotProps.item.image" width="original" fit="contain" />
    </template>

    <template #thumbnail="slotProps">
      <ImageBase :src="slotProps.item.thumb" width="w92" fit="contain" />
    </template>

    <template #footer>
      <div class="bg-background-scale-c text-sm flex items-center gap-1 overflow-hidden">
        <button
          class      = "cursor-pointer py-1 px-2 hover:bg-background-scale-f focus-active:bg-background-scale-f"
          aria-label = "Thumbnails"
          @click     = "() => showThumbnails = !showThumbnails"
        >
          <Icon name="i-ph-images-square" />
        </button>

        <span class="text-nowrap mr-4">
          {{ activeIndex + 1 }} / {{ normalizedSources.length }}
        </span>

        <span class="text-nowrap truncate font-semibold">
          {{ normalizedSources[activeIndex]?.image.friendlyName }}
        </span>
      </div>
    </template>
  </PrimeGalleria>
</template>


<script lang="ts">
  import type { ImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import type { HTMLElementClassNames } from '../types';

  export interface ImageGalleryProps {
    sources? : ImageFileDescriptor[];
    class?   : HTMLElementClassNames;
  }
</script>


<script setup lang="ts">
  import { normalizeImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import PrimeGalleria, { type GalleriaPassThroughOptions } from 'primevue/galleria';
  import { computed, ref } from 'vue';
  import { useReseeUxStore } from '../stores/use-resee-ux-store';
  import Icon from './Icon.vue';
  import ImageBase from './ImageBase.vue';

  const props = withDefaults(
    defineProps<ImageGalleryProps>(),
    {
      sources: undefined,
    },
  );

  const { locale }     = useReseeUxStore();
  const activeIndex    = ref(0);
  const showThumbnails = ref(false);

  const normalizedSources = computed(() => {
    if (!props.sources?.length) {
      return [];
    }

    return props.sources.map((entry) => {
      const normalized = normalizeImageFileDescriptor(entry);

      return {
        image : normalized,
        thumb : { ...normalized, width: 92 },
      };
    });
  });

  const passThrough = computed(() => {
    return {
      root    : { class: ['gallery', props.class] },
      content : { class: 'content' },
      items   : { class: 'items' },
      item    : { class: 'item' },

      thumbnails         : { class: 'thumbnails' },
      thumbnailsViewport : { class: 'thumb-viewport' },
      thumbnailContent   : { class: 'thumb-content' },
      thumbnailItems     : { class: 'thumb-items' },
      thumbnailItem      : { class: 'thumb-item' },

      prevButton          : { 'class': 'btn-prev btn borderless icon-only', 'aria-label': locale.aria.previous },
      nextButton          : { 'class': 'btn-next btn borderless icon-only', 'aria-label': locale.aria.next },
      thumbnailPrevButton : { 'class': 'btn borderless small icon-only' },
      thumbnailNextButton : { 'class': 'btn borderless small icon-only' },

    } as GalleriaPassThroughOptions;
  });
</script>

<style scoped>
  @reference "tailwindcss";

  .gallery {
    border        : solid 1px var(--color-global-background-accent);
    background    : var(--color-background-scale-a);
    border-radius : var(--radius-lg);
    max-width     : var(--container-xl);
    overflow      : clip;

    &:deep(.content) {
      position: relative;
    }

    &:deep(.items) {
      .item {
        height          : 400px;
        display         : flex;
        align-items     : center;
        justify-content : center;
      }

      img { max-height: 100%; }

      .btn-prev, .btn-next {
        position  : absolute;
        top       : 50%;
        transform : translateY(-50%);
      }

      .btn-prev { left: --spacing(2); }
      .btn-next { right: --spacing(2); }
    }

    &:deep(.thumbnails) {
      position        : absolute;
      left            : 0;
      right           : 0;
      bottom          : 0;
      background      : --alpha(var(--color-global-background) / 0.8);
      backdrop-filter : blur(var(--blur-sm));
      padding         : 0 --spacing(2);
      border-top      : solid 1px var(--color-global-background-accent);
      border-bottom   : solid 1px var(--color-global-background-accent);
    }

    &:deep(.thumb-content) {
      display: flex;
      gap: --spacing(4);

      .btn {
        flex-shrink : 0;
        align-self  : center;
      }

      .thumb-viewport {
        overflow  : hidden;
        flex-grow : 1;
      }

      .thumb-items {
        display     : flex;
        gap         : --spacing(1);
        align-items : center;
        cursor      : pointer;
      }
    }
  }
</style>
