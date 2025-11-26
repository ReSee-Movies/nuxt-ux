<template>
  <PrimeFormField
    v-slot         = "$field"
    :as            = "props.is"
    :name          = "props.name"
    :resolver      = "validatorFunction"
    :initial-value = "props.initialValue"
    :class         = "['form-field', { disabled: isDisabled }]"
  >
    <FormLabelGroup
      :label-is   = "props.labelIs"
      :label-text = "labelText"
      :layout     = "props.layout"
      :required   = "props.required"
      :input-id   = "inputId"
    >
      <template #label>
        <slot name="label" />
      </template>

      <template #default>
        <slot
          name        = "default"
          :input-id   = "inputId"
          :message-id = "$field.error ? messageId : undefined"
          :disabled   = "isDisabled"
          :readonly   = "isReadonly"
        />
      </template>
    </FormLabelGroup>

    <FormValidationMessage
      v-if     = "$field.error"
      :id      = "messageId"
      :visible = "$field.touched || formState.hasSubmitted.value"
      :message = "$field.error.message"
    >
      <template #default>
        <slot name="validation" />
      </template>
    </FormValidationMessage>
  </PrimeFormField>
</template>


<script lang="ts">
  import { pluckObject } from '@resee-movies/utilities/objects/pluck-object';
  import { computed } from 'vue';
  import type { ZodMiniType } from 'zod/mini';
  import type { HintedString } from '../../types';
  import type { FormLabelGroupProps } from './FormLabelGroup.vue';

  export interface FormFieldProps {
    name          : string;
    is?           : HintedString<'div'>;
    labelIs?      : FormLabelGroupProps['labelIs'];
    label?        : string;
    initialValue? : unknown;
    required?     : boolean;
    disabled?     : boolean;
    readonly?     : boolean;
    layout?       : FormLabelGroupProps['layout'];
    validator?    : (value: unknown, label: string) => undefined | ZodMiniType;
  }

  export function useFormFieldProps<T extends Record<string, unknown>>(props: T) {
    return computed(() => {
      return pluckObject(props, [
        'is', 'name', 'label', 'initialValue', 'required', 'disabled', 'readonly', 'layout',
      ]);
    });
  }
</script>


<script setup lang="ts">
  import PrimeFormField, { type FormFieldResolverOptions } from '@primevue/forms/formfield';
  import { humanize } from '@resee-movies/utilities/strings/humanize';
  import { useId } from 'vue';
  import { injectFormInstance } from '../../utils/form';
  import FormLabelGroup from './FormLabelGroup.vue';
  import FormValidationMessage from './FormValidationMessage.vue';

  const props = withDefaults(
    defineProps<FormFieldProps>(),
    {
      is           : 'div',
      label        : undefined,
      initialValue : undefined,
      required     : false,
      disabled     : false,
      readonly     : false,
      layout       : undefined,
      validator    : undefined,
    },
  );

  const formState = injectFormInstance();
  const inputId   = useId();
  const messageId = `${ inputId }_message`;

  const labelText = computed(() => {
    return props.label ?? humanize(props.name);
  });

  const isDisabled = computed(() => {
    return props.disabled || formState.isDisabled.value;
  });

  const isReadonly = computed(() => {
    return props.readonly || formState.isSubmitting.value;
  });


  const validatorFunction = computed(() => {
    return ({ value }: FormFieldResolverOptions) => {
      const result = props?.validator?.(value, labelText.value)?.safeParse(value);

      if (result?.error?.issues.length) {
        return { errors: result.error.issues };
      }

      return undefined;
    };
  });
</script>
