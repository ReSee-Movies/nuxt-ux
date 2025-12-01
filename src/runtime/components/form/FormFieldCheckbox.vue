<template>
  <FormField v-bind="props" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, messageId, disabled, readonly }">
      <PrimeCheckbox
        :input-id         = "inputId"
        :value            = "props.value"
        :true-value       = "props.trueValue"
        :false-value      = "props.falseValue"
        :binary           = "props.binary"
        :aria-describedby = "messageId"
        :disabled         = "disabled"
        :readonly         = "readonly"
        class             = "input-group"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import { computed } from 'vue';
  import type { FormFieldProps } from './FormField.vue';

  export interface FormFieldCheckboxProps extends Omit<FormFieldProps, 'validator'> {
    value?      : unknown;
    trueValue?  : unknown;
    falseValue? : unknown;
    binary?     : boolean;
  }
</script>


<script setup lang="ts">
  import PrimeCheckbox from 'primevue/checkbox';
  import { createBooleanValidator } from '../../utils/validation';
  import FormField from './FormField.vue';

  const props = withDefaults(
    defineProps<FormFieldCheckboxProps>(),
    {
      labelPosition : 'after',
      value         : undefined,
      trueValue     : () => true,
      falseValue    : () => false,
      binary        : () => true,
      initialValue  : () => false,
    },
  );

  const validatorFunction = computed(() => {
    return () => createBooleanValidator({ required: props.required });
  });
</script>
