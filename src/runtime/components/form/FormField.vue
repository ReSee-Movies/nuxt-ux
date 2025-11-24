<template>
  <PrimeFormField
    v-slot         = "$field"
    :name          = "props.name"
    :resolver      = "validatorFunction"
    :initial-value = "props.initialValue"
    :class         = "['form-field', { disabled: props.disabled || isFormDisabled }]"
  >
    <div :class="['labelled-group', props.layout ? `layout-${ props.layout }` : undefined]">
      <label
        :class = "['label', { required: props.required }]"
        :for   = "inputId"
      >
        <slot name="label">
          {{ labelText }}
        </slot>
      </label>

      <slot
        :input-id   = "inputId"
        :message-id = "$field.error ? messageId : undefined"
        :disabled   = "props.disabled || isFormDisabled"
        :readonly   = "props.readonly || isSubmitPending"
      />
    </div>

    <div
      v-if        = "$field.error"
      :id         = "messageId"
      aria-atomic = "true"
      aria-live   = "polite"
      :class      = "[
        'validation-message',
        {
          visible   : $field.touched || hasBeenSubmitted,
          invisible : !($field.touched && hasBeenSubmitted),
        },
      ]"
    >
      {{ $field.error.message }}
    </div>
  </PrimeFormField>
</template>


<script lang="ts">
  import type { ZodMiniType } from 'zod/mini';

  export interface FormFieldProps {
    name          : string;
    label?        : string;
    initialValue? : string;
    required?     : boolean;
    disabled?     : boolean;
    readonly?     : boolean;
    layout?       : 'inline' | 'inline-reverse';
    validator?    : (value: unknown) => undefined | ZodMiniType;
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
      layout   : undefined,
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
      const result = props?.validator?.(value)?.safeParse(value);

      if (result?.error?.issues.length) {
        return { errors: result.error.issues };
      }

      return undefined;
    };
  });
</script>
