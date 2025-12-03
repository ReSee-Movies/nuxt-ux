<template>
  <FormField v-bind="props" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputName, inputId, labelId, messageId, disabled, readonly }">
      <FormElementSelectOptions
        :name                  = "inputName"
        :input-id              = "inputId"
        :label-id              = "labelId"
        :disabled              = "disabled"
        :readonly              = "readonly"
        :aria-describedby      = "messageId"
        :multiple              = "props.multiple"
        :options               = "props.options"
        :option-label          = "props.optionLabel"
        :option-value          = "props.optionValue"
        :option-disabled       = "props.optionDisabled"
        :data-key              = "props.dataKey"
        :placeholder           = "props.placeholder"
        :show-clear            = "props.showClear"
        :show-option-footer    = "props.showOptionFilter"
        :filter-placeholder    = "props.filterPlaceholder"
        :loading               = "props.loading"
      />
    </template>
  </FormField>
</template>


<script lang="ts">
  import { type FormFieldProps } from './FormField.vue';

  export interface FormFieldSelectProps extends Omit<FormFieldProps, 'validator'> {
    options?             : unknown[];
    optionLabel?         : string;
    optionValue?         : string;
    optionDisabled?      : string;
    dataKey?             : string;
    placeholder?         : string;
    showClear?           : boolean;
    showOptionFilter?    : boolean;
    filterPlaceholder?   : string;
    loading?             : boolean;
    multiple?            : boolean;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import { createBooleanValidator } from '../../utils/validation';
  import FormField from './FormField.vue';
  import FormElementSelectOptions from './element/FormElementSelectOptions.vue';

  const props = withDefaults(
    defineProps<FormFieldSelectProps>(),
    {
      fauxLabel        : true,
      showClear        : true,
      showOptionFilter : undefined,
      multiple         : false,
    },
  );

  const validatorFunction = computed(() => {
    return () => createBooleanValidator({ required: props.required });
  });
</script>
