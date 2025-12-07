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
    :selection-limit    = "props.multiple ? props.selectionLimit : undefined"
    :show-clear         = "props.showClear"
    :show-toggle-all    = "showSelectAllCheckbox"
    :filter             = "showFilter"
    :filter-placeholder = "props.filterPlaceholder ?? locale.form.filterPlaceholder"
    :loading            = "props.loading"
    :pt                 = "props.multiple ? multiSelectPassthroughProps : selectPassthroughProps"
    :append-to          = "TeleportId"
    checkbox-icon       = "i-ph-check-bold"
  >
    <template #value="{ value, placeholder }">
      <template v-if="value && (Array.isArray(value) ? value.length : true)">
        <slot name="label">
          {{ toLabel(value) || '&ZeroWidthSpace;' }}
        </slot>
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
        severity         = "unset"
        icon             = "i-ph-x"
        class            = "input-group-addon"
        @click           = "clearCallback"
        :data-pc-section = "'clearicon' /* used internally by Primevue. No idea why they offer the slot like this. */"
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

    <template #option="{ option, selected, index }" v-if="slots.option">
      <slot name="option" :option="option" :selected="selected" :index="index" />
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
    selectionLimit?   : string | number;
  }
</script>


<script setup lang="ts">
  import { equals, resolveFieldData } from '@primeuix/utils/object';
  import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
  import PrimeMultiSelect from 'primevue/multiselect';
  import PrimeSelect from 'primevue/select';
  import { computed, useSlots } from 'vue';
  import { useReseeUx } from '../../../composables/use-resee-ux';
  import { TeleportId } from '../../../constants';
  import { blockBodyScroll } from '../../../utils/dom';
  import { swapStringPlaceholders } from '../../../utils/string';
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
      selectionLimit   : undefined,
    },
  );

  const slots = useSlots();

  const { locale } = useReseeUx();

  const isSmall = useBreakpoints(breakpointsTailwind).smallerOrEqual('sm');

  const showFilter = computed(() => {
    return props.showOptionFilter ?? (props.options?.length ?? 0) > 20;
  });

  const showSelectAllCheckbox = computed(() => {
    return props.multiple ? showFilter.value : undefined;
  });

  let unblockScroll: (() => void) | undefined = undefined;

  const sharedPassthroughProps = computed(() => {
    return {
      header                : { class: 'menu-prefix input-menu-header' },
      overlay               : { class: 'menu input-menu' },
      dropdown              : { class: 'input-group-addon' },
      listContainer         : { class: 'menu-list' },
      pcFilterContainer     : { root: { class: 'input-menu-filter' } },
      pcFilterIconContainer : { root: { class: 'input-group-addon' } },
      emptyMessage          : { 'aria-disabled': 'true' },

      transition: {
        name: isSmall.value ? 'slide-in-bottom' : 'fade',

        onBeforeEnter() {
          if (isSmall.value) {
            unblockScroll = blockBodyScroll();
          }
        },

        onAfterLeave() {
          unblockScroll?.();
          unblockScroll = undefined;
        },
      },
    };
  });

  const selectPassthroughProps = computed(() => {
    return {
      ...sharedPassthroughProps.value,

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
      ...sharedPassthroughProps.value,

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
          'aria-label' : locale.form.selectAllOptions,
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

    return swapStringPlaceholders(locale.form.numOptionsSelected, { count: value.length });
  }
</script>
