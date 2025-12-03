<template>
  <Component
    :is                    = "props.multiple ? PrimeMultiSelect : PrimeSelect"
    :name                  = "props.name"
    :input-id              = "props.inputId"
    :disabled              = "props.disabled || props.readonly"
    :class                 = "['input-group']"
    :options               = "props.options"
    :option-label          = "props.optionLabel"
    :option-value          = "props.optionValue"
    :option-disabled       = "props.optionDisabled"
    :option-group-label    = "props.optionGroups ? props.optionGroupLabel : undefined"
    :option-group-children = "props.optionGroups ? props.optionGroupChildren : undefined"
    :data-key              = "props.dataKey ?? (isString(props.optionValue) ? props.optionValue : undefined)"
    :placeholder           = "props.placeholder"
    :show-clear            = "props.showClear"
    :show-toggle-all       = "showSelectAllCheckbox"
    :filter                = "showFilter"
    :filter-placeholder    = "props.filterPlaceholder ?? locale.form.filterPlaceholder"
    :loading               = "props.loading"
    :pt                    = "props.multiple ? multiSelectPassthroughProps : selectPassthroughProps"
  >
    <template #value="{ value, placeholder }">
      <span :class="['select-none', value ? undefined : 'placeholder']">
        {{ value ?? placeholder ?? '&nbsp;' }}
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
  </Component>
</template>


<script lang="ts">
  import { type SelectProps as PrimeSelectProps } from 'primevue/select';

  export interface FormElementSelectOptionsProps extends Omit<PrimeSelectProps, 'inputId' | 'labelId'> {
    inputId?          : string;
    labelId?          : string;
    optionGroups?     : boolean;
    multiple?         : boolean;
    readonly?         : boolean;
    showOptionFilter? : boolean;
    ariaDescribedby?  : string;
  }
</script>


<script setup lang="ts">
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import PrimeMultiSelect from 'primevue/multiselect';
  import PrimeSelect from 'primevue/select';
  import { computed } from 'vue';
  import { useReseeUx } from '../../../composables/use-resee-ux';
  import Button from '../../Button.vue';
  import Icon from '../../Icon.vue';
  import ProgressSpinner from '../../ProgressSpinner.vue';

  const props = withDefaults(
    defineProps<FormElementSelectOptionsProps>(),
    {
      optionGroups        : false,
      multiple            : false,
      readonly            : false,
      optionLabel         : 'label',
      optionValue         : 'value',
      optionDisabled      : 'disabled',
      optionGroupLabel    : 'label',
      optionGroupChildren : 'items',
      showClear           : true,
      showOptionFilter    : undefined,
    },
  );

  const { locale } = useReseeUx();

  const showFilter = computed(() => {
    return props.showOptionFilter ?? (props.options?.length ?? 0) > 20;
  });

  const showSelectAllCheckbox = computed(() => {
    return props.multiple ? showFilter.value : undefined;
  });

  const sharedPassthroughProps = {
    header                : { class: 'menu-prefix input-menu-header' },
    overlay               : { class: 'menu input-menu' },
    dropdown              : { class: 'input-group-addon' },
    listContainer         : { class: 'overflow-y-auto styled-scroll' },
    pcFilterContainer     : { root: { class: 'input-menu-filter' } },
    pcFilterIconContainer : { root: { class: 'input-group-addon' } },
    emptyMessage          : { 'aria-disabled': 'true' },
    transition            : { name: 'fade' },
  };

  const selectPassthroughProps = computed(() => {
    return {
      ...sharedPassthroughProps,

      label: {
        'class'            : 'input-control',
        'aria-describedby' : props.ariaDescribedby,
        'aria-labelledby'  : props.labelId,
        'aria-readonly'    : props.readonly,
      },
    };
  });

  const multiSelectPassthroughProps = computed(() => {
    return {
      ...sharedPassthroughProps,

      labelContainer: {
        class: 'input-control',
      },

      hiddenInput: {
        'aria-describedby' : props.ariaDescribedby,
        'aria-labelledby'  : props.labelId,
        'aria-readonly'    : props.readonly,
      },

      pcHeaderCheckbox: {
        root: {
          class: 'input-group',
        },

        input: {
          'id'         : `${ props.inputId }_select_all`,
          'aria-label' : 'Select All',
        },
      },

      pcOptionCheckbox: {
        root: {
          class: 'input-group',
        },
      },
    };
  });
</script>
