<template>
  <UiAccordion>
    <UiAccordionPanel title="Panel 1">
      <UiLorem />
    </UiAccordionPanel>

    <UiAccordionPanel title="Panel 2">
      <UiLorem />
    </UiAccordionPanel>
  </UiAccordion>
</template>

<script setup lang="ts">
  definePageMeta({
    heading: 'Accordion',
  });
</script>
