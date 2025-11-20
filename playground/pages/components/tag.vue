<template>
  <UiTag text="Hello" tooltip="Here is some more information" />
  <br>
  <UiTag text="World" icon="i-ph-chart-bar" severity="help" />
</template>

<script setup lang="ts">
  definePageMeta({
    heading: 'Tag',
  });
</script>
