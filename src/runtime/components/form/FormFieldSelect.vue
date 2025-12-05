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
        :selection-limit       = "props.maxRequired"
      >
        <template #option="{ option, selected, index }" v-if="slots.option">
          <slot
            name      = "option"
            :option   = "option as T"
            :selected = "selected"
            :index    = "index"
          />
        </template>
      </FormElementSelectOptions>
    </template>
  </FormField>
</template>


<script lang="ts">
  import { type FormFieldProps } from './FormField.vue';

  export interface FormFieldSelectProps<T = unknown> extends Omit<FormFieldProps, 'validator'> {
    options?           : T[];
    optionLabel?       : string;
    optionValue?       : string;
    optionDisabled?    : string;
    dataKey?           : string;
    placeholder?       : string;
    showClear?         : boolean;
    showOptionFilter?  : boolean;
    filterPlaceholder? : string;
    loading?           : boolean;
    multiple?          : boolean;
    minRequired?       : string | number;
    maxRequired?       : string | number;
  }
</script>


<script setup lang="ts" generic="T">
  import { computed, useSlots } from 'vue';
  import { createBooleanValidator, createListValidator } from '../../utils/validation';
  import FormField from './FormField.vue';
  import FormElementSelectOptions from './element/FormElementSelectOptions.vue';

  const props = withDefaults(
    defineProps<FormFieldSelectProps<T>>(),
    {
      fauxLabel        : true,
      showClear        : true,
      showOptionFilter : undefined,
      multiple         : false,
    },
  );

  const slots = useSlots();

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
