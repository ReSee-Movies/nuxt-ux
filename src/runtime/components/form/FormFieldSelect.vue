<template>
  <FormField v-bind="props" :validator="validatorFunction">
    <template #label>
      <slot name="label" />
    </template>

    <template #default="{ inputName, inputId, labelId, messageId, disabled, readonly }">
      <PrimeSelect
        :name                     = "inputName"
        :input-id                 = "inputId"
        :disabled                 = "disabled || readonly"
        :class                    = "['input-group']"
        :options                  = "processedOptions"
        :option-label             = "props.optionLabel"
        :option-value             = "props.optionValue"
        :option-disabled          = "props.optionDisabled"
        :option-group-label       = "props.optionGroups ? props.optionGroupLabel : undefined"
        :option-group-children    = "props.optionGroups ? props.optionGroupChildren : undefined"
        :data-key                 = "props.dataKey ?? props.optionValue"
        :placeholder              = "props.placeholder"
        :show-clear               = "props.showClear"
        :filter                   = "props.showOptionFilter ?? (processedOptions?.length ?? 0) > 20"
        :filter-placeholder       = "props.filterPlaceholder ?? locale.form.filterPlaceholder"
        :pt:transition:name       = "'fade'"
        :pt:header:class          = "['menu-prefix']"
        :pt:overlay:class         = "['menu input-menu']"
        :pt:dropdown:class        = "['input-group-addon']"
        :pt:listContainer:class   = "['overflow-y-auto styled-scroll']"
        :pt:pcFilterContainer     = "{ root: { class: 'input-menu-filter' } }"
        :pt:pcFilterIconContainer = "{ root: { class: 'input-group-addon' } }"
        :pt:emptyMessage          = "{ 'aria-disabled': 'true' }"
        :pt:label                 = "{
          'aria-describedby' : messageId,
          'aria-labelledby'  : labelId,
          'class'            : 'input-control',
          'aria-readonly'    : readonly,
        }"
      >
        <template #value="{ value, placeholder }">
          <span :class="['select-none', value ? undefined : 'placeholder']">
            {{ value ?? placeholder }}
          </span>
        </template>

        <template #loadingicon>
          <ProgressSpinner />
        </template>

        <template #dropdownicon>
          <Icon name="i-ph-caret-down-bold" />
        </template>

        <template #clearicon="{ clearCallback }">
          <Button
            severity = "unset"
            icon     = "i-ph-x"
            class    = "input-group-addon"
            @click   = "clearCallback"
          />
        </template>

        <template #filtericon>
          <Icon name="i-ph-magnifying-glass" />
        </template>

        <template #emptyfilter>
          <span>{{ locale.form.filterNoResults }}</span>
        </template>

        <template #empty>
          <span>{{ locale.form.noOptionsAvailable }}</span>
        </template>
      </PrimeSelect>
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
  }
</script>


<script setup lang="ts">
  import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
  import PrimeSelect from 'primevue/select';
  import { computed } from 'vue';
  import { useReseeUx } from '../../composables/use-resee-ux';
  import { createBooleanValidator } from '../../utils/validation';
  import Button from '../Button.vue';
  import Icon from '../Icon.vue';
  import ProgressSpinner from '../ProgressSpinner.vue';
  import FormField from './FormField.vue';

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
    },
  );

  const { locale } = useReseeUx();

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
