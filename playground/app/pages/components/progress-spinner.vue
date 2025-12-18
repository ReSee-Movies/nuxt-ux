<template>
  <dl class="grid gap-4 grid-cols-[min-content_1fr]">
    <dt>Small</dt>
    <dd><UiProgressSpinner size="sm" /></dd>

    <dt class="text-nowrap">Medium (default)</dt>
    <dd><UiProgressSpinner /></dd>

    <dt>Large</dt>
    <dd><UiProgressSpinner size="lg" /></dd>

    <dt>X-Large</dt>
    <dd><UiProgressSpinner size="xl" /></dd>
  </dl>
</template>


<script setup lang="ts">
  definePageMeta({
    heading: 'ProgressSpinner',
  });
</script>
