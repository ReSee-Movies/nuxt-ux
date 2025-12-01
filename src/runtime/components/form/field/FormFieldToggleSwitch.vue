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
  import { computed } from 'vue';
  import FormField, { useFormFieldProps } from '../FormField.vue';
  import { createBooleanValidator } from '../../../utils/validation';

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

  const validatorFunction = computed(() => {
    return () => createBooleanValidator({ required: props.required });
  });
</script>
