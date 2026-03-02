<template>
  <div>
    <UiImageGallery :sources="imageSources" class="mx-auto" />
  </div>
</template>

<script setup lang="ts">
  import {
    normalizeImageFileDescriptor,
    type NormalizedFileDescriptor,
  } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import { computed } from 'vue';
  import { TmdbBackgrounds, TmdbPosters } from '../../constants';

  definePageMeta({
    heading: 'Image Gallery',
  });

  const imageSources = computed(() => {
    const bgLength     = TmdbBackgrounds.length;
    const posterLength = TmdbPosters.length;
    const maxLength    = Math.max(bgLength, posterLength);
    const result       = [] as NormalizedFileDescriptor[];

    for (let i = 0; i < maxLength; i += 1) {
      if (i < bgLength) {
        result.push({
          ...normalizeImageFileDescriptor({ filename: TmdbBackgrounds.at(i), width: 780 }),

          friendlyName : `Background ${ i + 1 }`,
          description  : `A description of the background ${ i + 1 } image.`,
        });
      }

      if (i < posterLength) {
        result.push({
          ...normalizeImageFileDescriptor({ filename: TmdbPosters.at(i) }),

          friendlyName : `Poster ${ i + 1 }`,
          description  : `A description of the poster ${ i + 1 } image.`,
        });
      }
    }

    return result;
  });
</script>
