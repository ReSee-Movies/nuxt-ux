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
        :options               = "processedOptions"
        :option-label          = "props.optionLabel"
        :option-value          = "props.optionValue"
        :option-disabled       = "props.optionDisabled"
        :option-groups         = "props.optionGroups"
        :option-group-label    = "props.optionGroupLabel"
        :option-group-children = "props.optionGroupChildren"
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
    optionGroups?        : boolean;
    optionGroupLabel?    : string;
    optionGroupChildren? : string;
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
  import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
  import { computed } from 'vue';
  import { createBooleanValidator } from '../../utils/validation';
  import FormField from './FormField.vue';
  import FormElementSelectOptions from './element/FormElementSelectOptions.vue';

  const props = withDefaults(
    defineProps<FormFieldSelectProps>(),
    {
      fauxLabel           : true,
      optionLabel         : 'label',
      optionValue         : 'value',
      optionDisabled      : 'disabled',
      optionGroups        : false,
      optionGroupLabel    : 'label',
      optionGroupChildren : 'items',
      dataKey             : undefined,
      placeholder         : undefined,
      showClear           : true,
      showOptionFilter    : undefined,
      filterPlaceholder   : undefined,
      multiple            : false,
    },
  );

  const processedOptions = computed(
    () => Array.isArray(props.options) ? props.options.map(toOption) : undefined,
  );

  function toOption(item: unknown) {
    return isObjectLike(item) ? item : { [props.optionLabel]: item, [props.optionValue]: item };
  }

  const validatorFunction = computed(() => {
    return () => createBooleanValidator({ required: props.required });
  });
</script>
