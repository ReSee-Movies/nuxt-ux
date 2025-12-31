<template>
  <FormField v-bind="props" :validator="() => createTextValidator({ required: true })">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, inputName, onChange }">
      <FormElementTurnstile
        :id                  = "inputId"
        :sitekey             = "props.sitekey"
        :response-field-name = "inputName"
        :callback            = "(token) => onChange({ value: token })"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from './FormField.vue';

  export interface FormFieldTurnstileProps extends Omit<FormFieldProps, 'validator' | 'required' | 'name'> {
    sitekey : string;
    name?   : string;
  }
</script>


<script setup lang="ts">
  import { createTextValidator } from '../../utils/validation';
  import FormField from './FormField.vue';
  import FormElementTurnstile from './element/FormElementTurnstile.vue';

  const props = withDefaults(
    defineProps<FormFieldTurnstileProps>(),
    {
      name        : 'cf-turnstile-response', // The default name as provided by Cloudflare
      fauxLabel   : true,
      labelSrOnly : true,
    },
  );
</script>
