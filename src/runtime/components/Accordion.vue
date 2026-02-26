<template>
  <PrimeAccordion
    v-model:value = "activeValue"
    :multiple     = "props.multiple"
    expand-icon   = "i-ph-caret-down"
    collapse-icon = "i-ph-caret-up"
  >
    <slot />
  </PrimeAccordion>
</template>

<script lang="ts">
  export interface AccordionProps {
    multiple?      : boolean;
    selectOnFocus? : boolean;
  }
</script>

<script setup lang="ts">
  import PrimeAccordion from 'primevue/accordion';

  const props = withDefaults(
    defineProps<AccordionProps>(),
    {
      multiple      : false,
      selectOnFocus : false,
    },
  );

  const activeValue = defineModel<null | string | number | string[] | number[]>('activeValue', { default: null });
</script>
