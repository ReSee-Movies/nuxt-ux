<template>
  <Component
    :is                 = "props.multiple ? PrimeMultiSelect : PrimeSelect"
    :name               = "props.name"
    :input-id           = "props.inputId"
    :disabled           = "props.disabled || props.readonly"
    :class              = "['input-group']"
    :options            = "props.options"
    :option-label       = "props.optionLabel"
    :option-value       = "props.optionValue"
    :option-disabled    = "props.optionDisabled"
    :placeholder        = "props.placeholder"
    :show-clear         = "props.showClear"
    :show-toggle-all    = "showSelectAllCheckbox"
    :filter             = "showFilter"
    :filter-placeholder = "props.filterPlaceholder ?? locale.form.filterPlaceholder"
    :loading            = "props.loading"
    :pt                 = "props.multiple ? multiSelectPassthroughProps : selectPassthroughProps"
  >
    <template #value="{ value, placeholder }">
      <template v-if="value">
        {{ toLabel(value) }}
      </template>

      <span v-else class="placeholder">
        {{ placeholder || '&ZeroWidthSpace;' }}
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

  export interface FormElementSelectOptionsProps extends Omit<PrimeSelectProps, 'inputId' | 'labelId' | 'optionGroupLabel' | 'optionGroupChildren'> {
    inputId?          : string;
    labelId?          : string;
    multiple?         : boolean;
    readonly?         : boolean;
    showOptionFilter? : boolean;
    ariaDescribedby?  : string;
  }
</script>


<script setup lang="ts">
  import { equals, resolveFieldData } from '@primeuix/utils/object';
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
      multiple         : false,
      readonly         : false,
      showClear        : true,
      showOptionFilter : undefined,
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
        'class'            : 'input-control min-w-0 select-none truncate',
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
        class: 'input-control min-w-0',
      },

      label: {
        class: 'select-none truncate',
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


  function getOptionValue(option: unknown): unknown {
    return props.optionValue ? resolveFieldData(option, props.optionValue) : option;
  }

  function getOptionLabel(option: unknown): unknown {
    return props.optionLabel ? resolveFieldData(option, props.optionLabel) : option;
  }

  function findOptionByValue(value: unknown) {
    return props.options?.find(
      (option) => equals(getOptionValue(option), value, props.optionValue ? undefined : props.dataKey),
    );
  }

  function toLabel(value: unknown) {
    if (!value) {
      return undefined;
    }

    if (!Array.isArray(value)) {
      return getOptionLabel(findOptionByValue(value));
    }

    if (value.length === 0) {
      return undefined;
    }

    if (value.length === 1) {
      return getOptionLabel(findOptionByValue(value[0]));
    }

    return `${ value.length } items selected`;
  }
</script>
