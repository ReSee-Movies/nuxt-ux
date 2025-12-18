<template>
  <UiToggleButton
    on-text    = "On"
    on-icon    = "i-ph-toggle-right"
    off-text   = "Off"
    off-icon   = "i-ph-toggle-left"
    responsive = "shrink"
  />
</template>

<script setup lang="ts">
  import UiToggleButton from '#resee-ux/components/ToggleButton.vue';

  definePageMeta({
    heading: 'Toggle Button',
  });
</script>
