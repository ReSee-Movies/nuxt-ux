<template>
  <FormField v-bind="props" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, messageId, disabled, readonly }">
      <PrimeInputTextarea
        :id               = "inputId"
        :placeholder      = "props.placeholder"
        :rows             = "props.rows"
        :auto-resize      = "props.autoResize"
        :aria-describedby = "messageId"
        :disabled         = "disabled"
        :readonly         = "readonly"
        :required         = "props.required"
        :minlength        = "props.minLength"
        :maxlength        = "props.maxLength"
        class             = "input-control"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from './FormField.vue';

  export interface FormFieldTextareaProps extends Omit<FormFieldProps, 'validator'> {
    placeholder? : string;
    rows?        : string | number;
    autoResize?  : boolean;
    minLength?   : string | number;
    maxLength?   : string | number;
  }
</script>


<script setup lang="ts">
  import PrimeInputTextarea from 'primevue/textarea';
  import { computed } from 'vue';
  import FormField from './FormField.vue';
  import { createTextValidator } from '../../utils/validation';

  const props = withDefaults(
    defineProps<FormFieldTextareaProps>(),
    {
      placeholder : undefined,
      rows        : 5,
      autoResize  : true,
      minLength   : undefined,
      maxLength   : undefined,
    },
  );

  const validatorFunction = computed(() => {
    return () => createTextValidator({
      required  : props.required,
      minLength : props.minLength,
      maxLength : props.maxLength,
    });
  });
</script>
