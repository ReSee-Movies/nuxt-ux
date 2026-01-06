<template>
  <div>
    <UiImageTiler :images="TmdbPosters" />
  </div>
</template>


<script setup lang="ts">
  import { TmdbPosters } from '../../constants';

  definePageMeta({
    heading : 'Image Tiler',
    layout  : 'basic',
  });
</script>
