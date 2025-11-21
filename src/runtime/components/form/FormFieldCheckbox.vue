<template>
  <FormField v-bind="props">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, messageId, disabled, readonly }">
      <PrimeCheckbox
        :input-id         = "inputId"
        :value            = "props.value"
        :aria-describedby = "messageId"
        :disabled         = "disabled"
        :readonly         = "readonly"
        class             = "control-group"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from './FormField.vue';

  export interface FormFieldCheckboxProps extends FormFieldProps {
    value?: unknown;
  }
</script>


<script setup lang="ts">
  import PrimeCheckbox from 'primevue/checkbox';
  import FormField from './FormField.vue';

  const props = withDefaults(
    defineProps<FormFieldCheckboxProps>(),
    {
      layout: 'inline-reverse',
    },
  );
</script>
