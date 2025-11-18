<template>
  <h1 class="h1">UiDrawer</h1>

  <UiButton text="Open" @click="showDrawer = true" />

  <UiLorem type="paragraphs" min="20" />

  <UiDrawer v-model:visible="showDrawer" header="Drawer Title" position="top">
    <UiLorem type="paragraphs" max="2" />
    <hr class="hr">
    <UiLorem type="paragraphs" max="10" />
  </UiDrawer>
</template>


<script setup lang="ts">
  import { ref } from 'vue';
  const showDrawer = ref(false);
</script>
