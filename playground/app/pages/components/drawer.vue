<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-3">
      <UiButton
        text   = "Open Top"
        @click = "showTop = true"
      />

      <UiButton
        text   = "Open Right"
        @click = "showRight = true"
      />

      <UiButton
        text   = "Open Bottom"
        @click = "showBottom= true"
      />

      <UiButton
        text   = "Open Left"
        @click = "showLeft = true"
      />
    </div>

    <div class="prose">
      <UiLorem type="paragraphs" min="20" />
    </div>
  </div>

  <UiDrawer v-model:visible="showTop" header="Top Drawer" position="top">
    <UiLorem type="paragraphs" max="2" />
  </UiDrawer>

  <UiDrawer v-model:visible="showRight" header="Right Drawer" position="right">
    <UiLorem type="paragraphs" max="2" />
  </UiDrawer>

  <UiDrawer v-model:visible="showBottom" header="Bottom Drawer" position="bottom">
    <UiLorem type="paragraphs" max="2" />
  </UiDrawer>

  <UiDrawer v-model:visible="showLeft" header="Left Drawer" position="left">
    <UiLorem type="paragraphs" max="2" />
  </UiDrawer>
</template>


<script setup lang="ts">
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Drawer',
  });

  const showTop    = ref(false);
  const showRight  = ref(false);
  const showBottom = ref(false);
  const showLeft   = ref(false);
</script>
