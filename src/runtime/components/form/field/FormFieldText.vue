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
  import { toInteger } from '@resee-movies/utilities/numbers/to-integer';
  import PrimeInputText from 'primevue/inputtext';
  import type { ZodMiniType } from 'zod/mini';
  import * as z from 'zod/mini';
  import FormField from '../FormField.vue';

  const props = withDefaults(
    defineProps<FormFieldTextProps>(),
    {
      type      : 'text',
      minLength : undefined,
      maxLength : undefined,
    },
  );

  const formFieldProps = useFormFieldProps(props);


  function validatorFunction(_value: unknown, _label: string) {
    let validator: ZodMiniType = z.string({ error: 'Required' }).check(z.trim());

    if (props.required) {
      validator = validator.check(
        z.minLength(1, { error: 'Required' }),
      );
    }

    if (props.type === 'email') {
      validator = validator.check(
        z.email({ error: 'A valid email address is required' }),
      );
    }
    else if (props.type === 'url') {
      validator = validator.check(
        z.url({ error: 'A valid URL (https://...) is required' }),
      );
    }
    else {
      if (props.minLength) {
        validator = validator.check(
          z.minLength(toInteger(props.minLength), { error: `Must have at least ${ props.minLength } character(s)` }),
        );
      }

      if (props.maxLength) {
        validator = validator.check(
          z.maxLength(toInteger(props.maxLength), { error: `Cannot have more than ${ props.maxLength } character(s)` }),
        );
      }
    }

    if (!props.required) {
      validator = z.union([z.null({ error: 'Required' }), validator]);
    }

    return validator;
  }
</script>
