<template>
  <FormField v-bind="formFieldProps" :validator="validatorFunction">
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

    <template #validation>
      <slot name="validation" />
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from '../FormField.vue';

  export interface FormFieldToggleSwitchProps extends Omit<FormFieldProps, 'validator'> {
    trueValue?  : unknown;
    falseValue? : unknown;
  }
</script>


<script setup lang="ts">
  import PrimeToggleSwitch from 'primevue/toggleswitch';
  import * as z from 'zod/mini';
  import FormField, { useFormFieldProps } from '../FormField.vue';

  const props = withDefaults(
    defineProps<FormFieldToggleSwitchProps>(),
    {
      layout       : 'inline-reverse',
      trueValue    : () => true,
      falseValue   : () => false,
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
