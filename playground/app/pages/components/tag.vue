<template>
  <div class="flex gap-4 mb-4">
    <UiTag text="Default" tooltip="This is a default tag" />
    <UiTag text="Inverted" severity="inverted" tooltip="This is an inverted tag" />
    <UiTag text="Info" severity="info" tooltip="This is an info tag" />
    <UiTag text="Help" severity="help" tooltip="This is a help tag" />
  </div>

  <div class="flex gap-4">
    <UiTag text="Default" icon="i-ph-person-simple-bike" tooltip="This is a default tag" />
    <UiTag text="Inverted" :chip="false" icon="i-ph-person-simple-swim" severity="inverted" tooltip="This is an inverted tag" />
    <UiTag text="Info" icon="i-ph-person-simple-run" severity="info" tooltip="This is an info tag" />
    <UiTag text="Help" icon="i-ph-person-simple-ski" severity="help" tooltip="This is a help tag" />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    heading: 'Tag',
  });
</script>
