<template>
  <h1 class="h1">UiDrawer</h1>

  <UiButton text="Open" @click="showDrawer = true" />



  <UiDrawer v-model:visible="showDrawer" header="Drawer Title" position="right">
    Hello World
  </UiDrawer>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const showDrawer = ref(false);
</script>
