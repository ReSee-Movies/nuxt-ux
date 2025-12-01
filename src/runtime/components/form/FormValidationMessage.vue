<template>
  <div
    :id         = "props.id"
    aria-atomic = "true"
    aria-live   = "polite"
    :class      = "['input-validation', (props.visible ? 'visible' : 'invisible')]"
  >
    <slot name="default">
      {{ props.message }}
    </slot>
  </div>
</template>


<script lang="ts">
  export interface FormValidationMessageProps {
    id?      : string;
    visible? : boolean;
    message? : string;
  }
</script>


<script setup lang="ts">
  const props = withDefaults(
    defineProps<FormValidationMessageProps>(),
    {
      id      : undefined,
      visible : false,
      message : undefined,
    },
  );
</script>
