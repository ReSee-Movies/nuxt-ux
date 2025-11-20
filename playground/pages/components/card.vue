<template>
  <div class="grid grid-cols-3">
    <UiCard interactive>
      <template #content>
        <UiLorem type="sentences" min="5" />
      </template>
    </UiCard>
  </div>
</template>


<script setup lang="ts">
  definePageMeta({
    heading: 'Card',
  });
</script>
