<template>
  <FormField v-bind="props" is="fieldset" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputId, messageId, disabled, readonly, invalid }">
      <template v-for="(option, index) of options" :key="`${ inputId }_${ index }`">
        <FormLabelFieldLayout
          :label-position = "props.optionLabelPosition"
          :disabled       = "disabled"
          :readonly       = "readonly"
          :input-id       = "`${ inputId }_${ index }`"
          :label-text     = "utils.getOptionLabel(option)"
          class           = "mb-1"
        >
          <template #input>
            <PrimeRadioButton
              :value                     = "utils.getOptionValue(option)"
              :input-id                  = "`${ inputId }_${ index }`"
              :disabled                  = "disabled || utils.getOptionDisabled(option) || readonly"
              :invalid                   = "invalid"
              :pt:input:readonly         = "readonly"
              :pt:input:aria-describedby = "messageId"
              class                      = "input-group"
            />
          </template>
        </FormLabelFieldLayout>
      </template>
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from './FormField.vue';
  import type { FormLabelFieldLayoutProps } from './FormLabelFieldLayout.vue';

  export interface FormFieldRadioGroupProps extends Omit<FormFieldProps, 'validator'> {
    options              : unknown[];
    optionLabel?         : string;
    optionValue?         : string;
    optionDisabled?      : string;
    optionLabelPosition? : FormLabelFieldLayoutProps['labelPosition'];
  }
</script>


<script setup lang="ts">
  import PrimeRadioButton from 'primevue/radiobutton';
  import { computed } from 'vue';
  import { useOptionListMethods } from '../../utils/form';
  import { createBooleanValidator } from '../../utils/validation';
  import FormField from './FormField.vue';
  import FormLabelFieldLayout from './FormLabelFieldLayout.vue';

  const props = withDefaults(
    defineProps<FormFieldRadioGroupProps>(),
    {
      optionLabel         : undefined,
      optionValue         : undefined,
      optionDisabled      : undefined,
      optionLabelPosition : 'after',
    },
  );

  const utils = useOptionListMethods(props);

  const validatorFunction = computed(() => {
    return () => createBooleanValidator({ required: props.required });
  });
</script>
