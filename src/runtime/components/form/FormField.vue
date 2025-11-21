<template>
  <PrimeFormField
    v-slot    = "$field"
    :name     = "props.name"
    :resolver = "validatorFunction"
    :disabled = "props.disabled || isFormDisabled"
  >
    <label :for="inputId" class="block">
      {{ labelText }}
    </label>

    <slot
      :input-id   = "inputId"
      :message-id = "$field.error ? messageId : undefined"
      :disabled   = "props.disabled || isFormDisabled"
      :readonly   = "props.readonly || isSubmitPending"
    />

    <div
      v-if   = "$field.error"
      :id    = "messageId"
      :class = "[
        'text-danger opacity-0 h-0',
        {
         '!opacity-100 h-auto': $field.touched || hasBeenSubmitted,
        },
      ]"
    >
      {{ $field.error }}
    </div>
  </PrimeFormField>
</template>


<script lang="ts">
  export interface FormFieldProps {
    name      : string;
    label?    : string;
    required? : boolean;
    disabled? : boolean;
    readonly? : boolean;
  }
</script>


<script setup lang="ts">
  import PrimeFormField, { type FormFieldResolverOptions } from '@primevue/forms/formfield';
  import { humanize } from '@resee-movies/utilities/strings/humanize';
  import { computed, inject, useId } from 'vue';
  import { ReseeFormSymbol } from './Form.vue';

  const props = withDefaults(
    defineProps<FormFieldProps>(),
    {
      label    : undefined,
      required : false,
      disabled : false,
    },
  );

  const inputId   = useId();
  const messageId = `${ inputId }_message`;

  const labelText = computed(() => {
    return props.label ?? humanize(props.name);
  });

  const {
    isFormDisabled,
    isSubmitPending,
    hasBeenSubmitted,
  } = inject(ReseeFormSymbol) ?? {};


  const validatorFunction = computed(() => {
    return ({ value }: FormFieldResolverOptions) => {
      return props.required && !value
        ? { errors: ['Required'] }
        : undefined;
    };
  });
</script>
