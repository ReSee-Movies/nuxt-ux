<template>
  <Button
    :aria-label = "primevue.config.locale?.aria?.close"
    :tooltip    = "primevue.config.locale?.aria?.close"
    :bordered   = "false"
    icon        = "i-ph-x"
  />
</template>

<script setup lang="ts">
  import { usePrimeVue } from "primevue/config";
  import Button from './Button.vue';

  const primevue = usePrimeVue();
</script>
