<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-3">
      <UiButton text="Open Basic Dialog" @click="showTextDialog=true" />
      <UiButton text="Open Custom Dialog" @click="showCustomDialog=true" />
    </div>

    <div class="prose">
      <UiLorem type="paragraphs" min="20" />
    </div>
  </div>

  <UiDialog v-model:visible="showTextDialog" header="Basic Dialog Header">
    <UiLorem type="paragraphs" min="4" />
  </UiDialog>

  <UiDialog
    v-model:visible   = "showCustomDialog"
    header            = "Custom Dialog Header"
    :show-header-text = "false"
    :show-modal-style = "false"
    :sidebar-header   = "true"
    content-class     = "bg-black rounded-lg overflow-clip shadow-heavy"
  >
    <iframe
      src="https://www.youtube.com/embed/FTQbiNvZqaY?si=7yzTdJbZUnvvDYQ3"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      class="w-full h-auto aspect-video"
      allowfullscreen
    />
  </UiDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Dialog',
  });

  const showTextDialog   = ref(false);
  const showCustomDialog = ref(false);
</script>
