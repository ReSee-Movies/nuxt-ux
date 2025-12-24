<template>
  <div class="grid grid-cols-[16rem_1fr] gap-6">
    <div>
      <ScrollPinnedContainer class="bg-global-background-accent p-3 rounded-sm">
        This container will remain pinned in place as you scroll.
      </ScrollPinnedContainer>
    </div>

    <div class="prose">
      <UiLorem type="paragraphs" min="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ScrollPinnedContainer from '#resee-ux/components/ScrollPinnedContainer.vue';

  definePageMeta({
    heading: 'Scroll Pinned Container',
  });
</script>
