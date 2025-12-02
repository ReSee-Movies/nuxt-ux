<template>
  <FormField v-bind="props" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, messageId, disabled, readonly }">
      <PrimeToggleSwitch
        :input-id         = "inputId"
        :aria-describedby = "messageId"
        :disabled         = "disabled || readonly"
        :readonly         = "readonly"
        class             = "input-group toggle-switch"
        pt:slider:class   = "slider"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from './FormField.vue';

  export interface FormFieldToggleSwitchProps extends Omit<FormFieldProps, 'validator'> {
    trueValue?  : unknown;
    falseValue? : unknown;
  }
</script>


<script setup lang="ts">
  import PrimeToggleSwitch from 'primevue/toggleswitch';
  import { computed } from 'vue';
  import FormField from './FormField.vue';
  import { createBooleanValidator } from '../../utils/validation';

  const props = withDefaults(
    defineProps<FormFieldToggleSwitchProps>(),
    {
      labelPosition : 'after',
      trueValue     : () => true,
      falseValue    : () => false,
      initialValue  : () => false,
    },
  );

  const validatorFunction = computed(() => {
    return () => createBooleanValidator({ required: props.required });
  });
</script>
