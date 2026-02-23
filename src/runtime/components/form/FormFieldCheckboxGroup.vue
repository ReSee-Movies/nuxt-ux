<template>
  <FormField v-bind="props" is="fieldset" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputName, value, inputId, messageId, readonly, invalid }">
      <PrimeCheckboxGroup :name="inputName" class="checkbox-group styled-scroll">
        <template v-for="(option, index) of options" :key="`${ inputId }_${ index }`">
          <FormLabelFieldLayout
            :label-position = "props.optionLabelPosition"
            :disabled       = "getOptionDisabled(option, value)"
            :readonly       = "readonly"
            :input-id       = "`${ inputId }_${ index }`"
            :label-text     = "utils.getOptionLabel(option)"
            class           = "mb-2 last:mb-0"
          >
            <template #input>
              <PrimeCheckbox
                :value                     = "utils.getOptionValue(option)"
                :input-id                  = "`${ inputId }_${ index }`"
                :disabled                  = "getOptionDisabled(option, value)"
                :invalid                   = "invalid"
                :pt:input:readonly         = "readonly"
                :pt:input:aria-describedby = "messageId"
                class                      = "input-group"
              />
            </template>
          </FormLabelFieldLayout>
        </template>
      </PrimeCheckboxGroup>
    </template>
  </FormField>
</template>


<script lang="ts">
  import type { FormFieldProps } from './FormField.vue';
  import type { FormLabelFieldLayoutProps } from './FormLabelFieldLayout.vue';

  export interface FormFieldCheckboxGroupProps extends Omit<FormFieldProps, 'validator'> {
    options              : unknown[];
    optionLabel?         : string;
    optionValue?         : string;
    optionDisabled?      : string;
    optionLabelPosition? : FormLabelFieldLayoutProps['labelPosition'];
    minRequired?         : string | number;
    maxRequired?         : string | number;
    maxHeight?           : string;
  }
</script>


<script setup lang="ts">
  import PrimeCheckbox from 'primevue/checkbox';
  import PrimeCheckboxGroup from 'primevue/checkboxgroup';
  import { toInteger } from '@resee-movies/utilities/numbers/to-integer';
  import { computed } from 'vue';
  import { useOptionListMethods } from '../../utils/form';
  import { createListValidator } from '../../utils/validation';
  import FormField from './FormField.vue';
  import FormLabelFieldLayout from './FormLabelFieldLayout.vue';

  const props = withDefaults(
    defineProps<FormFieldCheckboxGroupProps>(),
    {
      optionLabel         : undefined,
      optionValue         : undefined,
      optionDisabled      : undefined,
      optionLabelPosition : 'after',
      minRequired         : undefined,
      maxRequired         : undefined,
      maxHeight           : '300px',
    },
  );

  const utils = useOptionListMethods(props);

  const validatorFunction = computed(() => {
    return () => createListValidator({
      required    : props.required,
      minRequired : props.minRequired,
      maxRequired : props.maxRequired,
    });
  });

  function getOptionDisabled(option: unknown, values: unknown): boolean {
    // The entire control, or the individual option, is explicitly disabled
    if (props.disabled || props.readonly || utils.value.getOptionDisabled(option)) {
      return true;
    }

    // The control's selection limit has been reached,
    // and the given option is not in the list
    const limit  =  toInteger(props.maxRequired) || Number.POSITIVE_INFINITY;
    const length = Array.isArray(values) ? values.length : 0;

    return limit <= length && utils.value.getOptionIndex(option, values) === -1;
  }
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    .checkbox-group {
      --container-max-height-bind : v-bind(maxHeight);
      --container-max-height      : var(--container-max-height-bind, 300px);

      border        : solid 1px var(--color-background-scale-b);
      border-radius : var(--radius-md);
      padding       : --spacing(2);
      max-height    : var(--container-max-height);
      overflow-y    : auto;
    }
  }
</style>
