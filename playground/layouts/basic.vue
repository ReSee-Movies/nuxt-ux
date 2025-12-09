<template>
  <slot />
</template>

<script setup lang="ts">
  import { useHead, useRoute } from '#imports';

  const route = useRoute();

  useHead({
    title: () => `${ route.meta.heading } | ReSee UX`,
  });
</script>
