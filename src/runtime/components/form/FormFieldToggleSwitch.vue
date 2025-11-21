<template>
  <FormField v-bind="props">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, messageId, disabled, readonly }">
      <PrimeToggleSwitch
        :input-id         = "inputId"
        :aria-describedby = "messageId"
        :disabled         = "disabled"
        :readonly         = "readonly"
        class             = "control-group toggle-switch"
        pt:slider:class   = "slider"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from './FormField.vue';
  export interface FormFieldToggleSwitchProps extends FormFieldProps {}
</script>


<script setup lang="ts">
  import PrimeToggleSwitch from 'primevue/toggleswitch';
  import FormField from './FormField.vue';

  const props = withDefaults(
    defineProps<FormFieldToggleSwitchProps>(),
    {
      layout: 'inline-reverse',
    },
  );
</script>
