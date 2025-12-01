<template>
  <FormField v-bind="formFieldProps" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, messageId, disabled, readonly }">
      <PrimeInputText
        :id               = "inputId"
        :aria-describedby = "messageId"
        :disabled         = "disabled"
        :readonly         = "readonly"
        :type             = "props.type"
        :required         = "props.required"
        :minlength        = "props.minLength"
        :maxlength        = "props.maxLength"
        class             = "form-control"
      />
    </template>

    <template #validation>
      <slot name="validation" />
    </template>
  </FormField>
</template>


<script lang="ts">
  import { useFormFieldProps, type FormFieldProps } from '../FormField.vue';

  export interface FormFieldTextProps extends Omit<FormFieldProps, 'validator'> {
    type?      : 'text' | 'url' | 'email';
    minLength? : string | number;
    maxLength? : string | number;
  }
</script>


<script setup lang="ts">
  import PrimeInputText from 'primevue/inputtext';
  import { computed } from 'vue';
  import FormField from '../FormField.vue';
  import { createTextValidator } from '../../../utils/validation';

  const props = withDefaults(
    defineProps<FormFieldTextProps>(),
    {
      type      : 'text',
      minLength : undefined,
      maxLength : undefined,
    },
  );

  const formFieldProps = useFormFieldProps(props);

  const validatorFunction = computed(() => {
    return () => createTextValidator({
      required  : props.required,
      type      : props.type,
      minLength : props.minLength,
      maxLength : props.maxLength,
    });
  });
</script>
