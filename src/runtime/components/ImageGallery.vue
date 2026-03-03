<template>
  <Card
    :beveled  = "props.beveled"
    :bordered = "props.bordered"
  >
    <PrimeGalleria
      v-model:active-index  = "activeIndex"
      :value                = "normalizedSources"
      :pt                   = "passThrough"
      :num-visible          = "6"
      :show-item-navigators = "true"
      :show-thumbnails      = "props.showThumbnailToggle && showThumbnails"
    >
      <template #item="slotProps">
        <ImageBase :src="slotProps.item.image" width="original" fit="contain" />
      </template>

      <template #thumbnail="slotProps">
        <ImageBase :src="slotProps.item.thumb" width="w92" fit="contain" />
      </template>

      <template #footer>
        <div :class="['footer', { 'pt-1 pb-0.5 px-2': !props.showThumbnailToggle }]">
          <button
            v-if       = "props.showThumbnailToggle"
            class      = "cursor-pointer py-1 px-2 hover:bg-background-scale-f focus-active:bg-background-scale-f"
            aria-label = "Thumbnails"
            @click     = "() => showThumbnails = !showThumbnails"
          >
            <Icon name="i-ph-images-square" />
          </button>

          <span class="text-nowrap mr-2">
            {{ activeIndex + 1 }} / {{ normalizedSources.length }}
          </span>

          <span
            v-if  = "props.showImageTitles"
            class = "text-nowrap truncate font-semibold"
          >
            {{ normalizedSources[activeIndex]?.image.friendlyName }}
          </span>
        </div>
      </template>
    </PrimeGalleria>
  </Card>
</template>


<script lang="ts">
  import type { ImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import type { CardProps } from './Card.vue';

  export interface ImageGalleryProps extends Pick<CardProps, 'beveled' | 'bordered'> {
    sources?             : ImageFileDescriptor[];
    showThumbnailToggle? : boolean;
    showImageTitles?     : boolean;
    maxHeight?           : number | string;
  }
</script>


<script setup lang="ts">
  import { normalizeImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import PrimeGalleria, { type GalleriaPassThroughOptions } from 'primevue/galleria';
  import { computed, ref } from 'vue';
  import { useReseeUxStore } from '../stores/use-resee-ux-store';
  import Card from './Card.vue';
  import Icon from './Icon.vue';
  import ImageBase from './ImageBase.vue';

  const props = withDefaults(
    defineProps<ImageGalleryProps>(),
    {
      sources             : undefined,
      showThumbnailToggle : false,
      showImageTitles     : true,
      beveled             : true,
      bordered            : true,
      maxHeight           : 400,
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
      root    : { class: 'gallery' },
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

  const maxHeightString = computed(() => {
    return isString(props.maxHeight) ? props.maxHeight : `${ props.maxHeight }px`;
  });
</script>


<style scoped>
  @reference "tailwindcss";

  .gallery {
    background: var(--color-background-scale-a);

    &:deep(.content) {
      position: relative;
    }

    &:deep(.items) {
      .item {
        height          : v-bind(maxHeightString);
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

    .footer {
      border-top  : solid 1px var(--color-global-background-accent);
      background  : var(--color-background-scale-c);
      font-size   : var(--text-sm);
      display     : flex;
      gap         : --spacing(1);
      align-items : center;
      overflow    : hidden;
    }
  }
</style>
