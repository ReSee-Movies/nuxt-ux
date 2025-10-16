<template>
  <h1 class="h1">UiDialog</h1>

  <UiButton text="Open" @click="showDialog = true" />

  <UiLorem type="paragraphs" min="20" />

  <UiDialog v-model:visible="showDialog" header="Dialog Header">
    Hello World
  </UiDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const showDialog = ref(false);
</script>
