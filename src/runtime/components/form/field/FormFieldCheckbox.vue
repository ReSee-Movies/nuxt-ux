<template>
  <FormField v-bind="formFieldProps" :validator="validatorFunction">
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
        class             = "control-group"
      />
    </template>

    <template #validation>
      <slot name="validation" />
    </template>
  </FormField>
</template>


<script lang="ts">
  import { computed } from 'vue';
  import type { FormFieldProps } from '../FormField.vue';
  import { createBooleanValidator } from '../../../utils/validation';

  export interface FormFieldCheckboxProps extends Omit<FormFieldProps, 'validator'> {
    value?      : unknown;
    trueValue?  : unknown;
    falseValue? : unknown;
    binary?     : boolean;
  }
</script>


<script setup lang="ts">
  import PrimeCheckbox from 'primevue/checkbox';
  import FormField, { useFormFieldProps } from '../FormField.vue';

  const props = withDefaults(
    defineProps<FormFieldCheckboxProps>(),
    {
      layout       : 'inline-reverse',
      value        : undefined,
      trueValue    : () => true,
      falseValue   : () => false,
      binary       : () => true,
      initialValue : () => false,
    },
  );

  const formFieldProps = useFormFieldProps(props);

  const validatorFunction = computed(() => {
    return () => createBooleanValidator({ required: props.required });
  });
</script>
