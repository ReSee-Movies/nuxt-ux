<template>
  <div>
    <UiImageTiler :images="posters" />
  </div>

  <div class="flex gap-4">
    <UiButton text="Toggle Images" @click="toggleImages" />
  </div>
</template>


<script setup lang="ts">
  import { ref } from 'vue';
  import { TmdbPosters } from '../../constants';

  definePageMeta({
    heading : 'Image Tiler',
    layout  : 'basic',
  });

  const posters = ref<string[]>([]);

  function toggleImages() {
    posters.value = posters.value.length ? [] : TmdbPosters;
  }
</script>
