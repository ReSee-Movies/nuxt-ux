<template>
  <UiButton
    :aria-label = "primevue.config.locale?.aria?.close"
    :tooltip    = "primevue.config.locale?.aria?.close"
    :bordered   = "false"
    icon        = "i-ph-x"
  />
</template>

<script setup lang="ts">
  import { usePrimeVue } from "primevue/config";
  const primevue = usePrimeVue();
</script>
