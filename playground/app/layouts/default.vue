<template>
  <UiLayoutPageColumn layout="main">
    <UiLayoutPageContainer is="main" :heading-text="route.meta.heading">
      <slot />
    </UiLayoutPageContainer>
  </UiLayoutPageColumn>
</template>

<script setup lang="ts">
  import { useHead, useRoute } from '#imports';

  const route = useRoute();

  useHead({
    title: () => `${ route.meta.heading } | ReSee UX`,
  });
</script>
