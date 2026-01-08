<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-3">
      <UiButton
        text   = "Open"
        @click = "showTopDialog = true"
      />
    </div>

    <div class="prose">
      <UiLorem type="paragraphs" min="20" />
    </div>
  </div>

  <UiDialog v-model:visible="showTopDialog" header="Top Dialog Header">
    <UiLorem type="paragraphs" min="4" />
  </UiDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Dialog',
  });

  const showTopDialog = ref(false);
</script>
