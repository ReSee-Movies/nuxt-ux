<template>
  <FormField v-bind="props" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ value, labelId, messageId, invalid, disabled, readonly, onChange, onBlur }">
      <FormElementSelectButton
        :value            = "value"
        :aria-labelledby  = "labelId"
        :aria-describedby = "messageId"
        :aria-invalid     = "invalid"
        :disabled         = "disabled"
        :readonly         = "readonly"
        :options          = "props.options"
        :option-label     = "props.optionLabel"
        :option-icon      = "props.optionIcon"
        :option-value     = "props.optionValue"
        :option-disabled  = "props.optionDisabled"
        :option-data-key  = "props.optionDataKey"
        :icon-only        = "props.iconOnly"
        :multiple         = "props.multiple"
        :selection-limit  = "props.maxRequired ? toInteger(props.maxRequired) : undefined"
        @change           = "onChange"
        @focusout         = "onBlur"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import { type FormElementSelectButtonProps } from './element/FormElementSelectButton.vue';
  import { type FormFieldProps } from './FormField.vue';

  export interface FormFieldSelectButtonProps extends Omit<FormFieldProps, 'validator'>, FormElementSelectButtonProps {
    minRequired? : string | number;
    maxRequired? : string | number;
  }
</script>


<script setup lang="ts">
  import { toInteger } from '@resee-movies/utilities/numbers/to-integer';
  import { computed } from 'vue';
  import { createBooleanValidator, createListValidator } from '../../utils/validation';
  import FormField from './FormField.vue';
  import FormElementSelectButton from './element/FormElementSelectButton.vue';

  const props = withDefaults(
    defineProps<FormFieldSelectButtonProps>(),
    {
      fauxLabel : true,
      iconOnly  : false,
      multiple  : false,
    },
  );

  const validatorFunction = computed(() => {
    return props.multiple
      ? () => createListValidator({
        required    : props.required,
        minRequired : props.minRequired,
        maxRequired : props.maxRequired,
      })
      : () => createBooleanValidator({
        required: props.required,
      });
  });
</script>
