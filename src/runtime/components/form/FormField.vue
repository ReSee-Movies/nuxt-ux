<template>
  <PrimeFormField
    v-slot         = "$field"
    :as            = "props.is"
    :name          = "props.name"
    :resolver      = "validatorFunction"
    :initial-value = "props.initialValue"
    :class         = "['input-field', { disabled: isDisabled, readonly: isReadonly, required: props.required }]"
  >
    <FormLabelInputPair
      :input-id       = "inputId"
      :label-id       = "labelId"
      :label-text     = "labelText"
      :label-position = "props.labelPosition"
      :label-sr-only  = "props.labelSrOnly"
      :disabled       = "props.disabled"
      :required       = "props.required"
      :faux-label     = "props.fauxLabel"
    >
      <template #label>
        <slot name="label" />
      </template>

      <template #input>
        <slot
          name        = "default"
          :input-name = "props.name"
          :input-id   = "inputId"
          :label-id   = "labelId"
          :label-text = "labelText"
          :message-id = "$field.error ? messageId : undefined"
          :disabled   = "isDisabled"
          :readonly   = "isReadonly"
        />
      </template>
    </FormLabelInputPair>

    <FormValidationMessage
      v-if     = "$field.error"
      :id      = "messageId"
      :visible = "$field.touched || formState.hasSubmitted.value"
      :message = "$field.error.message"
    />
  </PrimeFormField>
</template>


<script lang="ts">
  import { computed } from 'vue';
  import type { ZodMiniType } from 'zod/mini';
  import type { HintedString, HTMLElementClassNames } from '../../types';
  import type { FormLabelInputPairProps } from './FormLabelInputPair.vue';

  export interface FormFieldProps {
    name           : string;
    label?         : string;
    is?            : HintedString<'div'>;
    initialValue?  : unknown;
    required?      : boolean;
    disabled?      : boolean;
    readonly?      : boolean;
    fauxLabel?     : boolean;
    labelSrOnly?   : boolean;
    labelPosition? : FormLabelInputPairProps['labelPosition'];
    validator?     : (value: unknown, label: string) => undefined | ZodMiniType;
    class?         : HTMLElementClassNames;
  }
</script>


<script setup lang="ts">
  import PrimeFormField, { type FormFieldResolverOptions } from '@primevue/forms/formfield';
  import { humanize } from '@resee-movies/utilities/strings/humanize';
  import { useId } from 'vue';
  import { injectFormInstance } from '../../utils/form';
  import FormLabelInputPair from './FormLabelInputPair.vue';
  import FormValidationMessage from './FormValidationMessage.vue';

  defineOptions({
    inheritAttrs: false,
  });

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

  const formState  = injectFormInstance();
  const inputId    = useId();
  const labelId    = `${ inputId }_label`;
  const messageId  = `${ inputId }_message`;
  const labelText  = computed(() => props.label ?? humanize(props.name));
  const isDisabled = computed(() => props.disabled || formState.isDisabled.value);
  const isReadonly = computed(() => props.readonly || formState.isSubmitting.value);

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
