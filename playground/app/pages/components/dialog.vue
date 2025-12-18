<template>
  <UiButton text="Open" @click="showDialog = true" />

  <UiLorem type="paragraphs" min="20" />

  <UiDialog v-model:visible="showDialog" header="Dialog Header">
    <UiLorem type="paragraphs" min="4" />
  </UiDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Dialog',
  });

  const showDialog = ref(false);
</script>
