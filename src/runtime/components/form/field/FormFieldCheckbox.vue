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
  import type { FormFieldProps } from '../FormField.vue';

  export interface FormFieldCheckboxProps extends Omit<FormFieldProps, 'validator'> {
    value?      : unknown;
    trueValue?  : unknown;
    falseValue? : unknown;
    binary?     : boolean;
  }
</script>


<script setup lang="ts">
  import PrimeCheckbox from 'primevue/checkbox';
  import * as z from 'zod/mini';
  import FormField, { useFormFieldProps } from '../FormField.vue';

  const props = withDefaults(
    defineProps<FormFieldCheckboxProps>(),
    {
      layout       : 'inline-reverse',
      value        : undefined,
      trueValue    : () => true,
      falseValue   : () => false,
      binary       : true,
      initialValue : () => false,
    },
  );

  const formFieldProps = useFormFieldProps(props);


  function validatorFunction(_value: unknown, _label: string) {
    if (props.required) {
      // Validate to something truthy, doesn't matter what exactly.
      return z.coerce.boolean().check(z.refine(val => val === true, { error: 'Required' }));
    }

    return undefined;
  }
</script>
