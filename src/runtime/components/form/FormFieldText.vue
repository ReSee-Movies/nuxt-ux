<template>
  <FormField v-bind="props" v-slot="{ inputId, messageId, disabled, readonly }">
    <PrimeInputText
      :id               = "inputId"
      :aria-describedby = "messageId"
      :disabled         = "disabled"
      :readonly         = "readonly"
    />
  </FormField>
</template>

<script setup lang="ts">
  import PrimeInputText from 'primevue/inputtext';
  import FormField, { type FormFieldProps } from './FormField.vue';

  const props = defineProps<FormFieldProps>();
</script>
