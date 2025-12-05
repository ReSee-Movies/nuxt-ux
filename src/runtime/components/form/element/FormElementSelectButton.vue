<template>
  <div
    role              = "group"
    class             = "input-group input-button-bar"
    :aria-labelledby  = "props.ariaLabelledby"
    :aria-describedby = "props.ariaDescribedby"
  >
    <template v-for="(option, index) of props.options" :key="getOptionRenderKey(option) ?? index">
      <ToggleButton
        severity    = "unset"
        :pressed    = "getSelectedOptionIndex(option) !== -1"
        :text       = "props.iconOnly ? undefined : getOptionLabel(option)"
        :icon       = "getOptionIcon(option)"
        :disabled   = "getOptionDisabled(option)"
        :readonly   = "readonly"
        :aria-label = "props.iconOnly ? getOptionLabel(option) : undefined"
        :tooltip    = "props.iconOnly ? getOptionLabel(option) : undefined"
        @click      = "(pressed) => handleToggleChange(option, pressed)"
      />
    </template>
  </div>
</template>


<script lang="ts">
  export interface FormElementSelectButtonProps {
    options          : unknown[];
    optionLabel?     : string;
    optionIcon?      : string;
    optionValue?     : string;
    optionDisabled?  : string;
    optionDataKey?   : string;
    iconOnly?        : boolean;
    multiple?        : boolean;
    ariaLabelledby?  : string;
    ariaDescribedby? : string;
    disabled?        : boolean;
    readonly?        : boolean;
    selectionLimit?  : number;
  }

  export class ChangeEvent extends Event {
    public readonly value: unknown;

    constructor(value: unknown) {
      super('change');
      this.value = value;
    }
  }
</script>


<script setup lang="ts">
  import { equals, resolveFieldData } from '@primeuix/utils/object';
  import { isNumber } from '@resee-movies/utilities/numbers/is-number';
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import ToggleButton from '../../ToggleButton.vue';

  const props = withDefaults(
    defineProps<FormElementSelectButtonProps>(),
    {
      iconOnly : false,
      multiple : false,
      disabled : false,
      readonly : false,
    },
  );

  const emits = defineEmits<{
    (e: 'change', event: ChangeEvent): void;
  }>();

  const value = defineModel<unknown | unknown[]>('value', { default: null });


  function getOptionLabel(option: unknown): string {
    return String(props.optionLabel ? resolveFieldData(option, props.optionLabel) : option);
  }


  function getOptionValue(option: unknown): unknown {
    return props.optionValue ? resolveFieldData(option, props.optionValue) : option;
  }


  function getOptionIcon(option: unknown): string | undefined {
    return props.optionIcon ? String(resolveFieldData(option, props.optionIcon)) : undefined;
  }


  /**
   *
   */
  function getOptionDisabled(option: unknown): boolean {
    // The entire control is disabled
    if (props.disabled) {
      return true;
    }

    // The individual option is disabled
    if (props.optionDisabled && resolveFieldData(option, props.optionDisabled)) {
      return true;
    }


    // The control's selection limit has been reached,
    // and the given option is not in the list
    if (props.multiple) {
      const limit  = props.selectionLimit ?? Number.POSITIVE_INFINITY;
      const length = Array.isArray(value.value) ? value.value.length : 0;

      if (limit <= length && getSelectedOptionIndex(option) === -1) {
        return true;
      }
    }

    return false;
  }


  /**
   * Attempts to return a suitable value for the provided option argument that can
   * be used as that option's `key` in the template's for loop.
   */
  function getOptionRenderKey(option: unknown): string | number | undefined {
    const result = props.optionDataKey
      ? resolveFieldData(option, props.optionDataKey)
      : getOptionLabel(option);

    return isString(result) || isNumber(result) ? result : undefined;
  }


  /**
   * Finds the index of the provided option in the selected options array. This
   * will always return a number, even if no options have been selected and `value`
   * is null (-1), or the control is in single selection mode and so `value` is
   * not an array (0 if matched, -1 if not).
   */
  function getSelectedOptionIndex(option: unknown): number {
    if (!value.value) {
      return -1;
    }

    const equalityKey = props.optionValue ? undefined : props.optionDataKey;
    const optionValue = getOptionValue(option);

    if (Array.isArray(value.value)) {
      return value.value.findIndex((entry) => equals(getOptionValue(entry), optionValue, equalityKey));
    }

    return equals(getOptionValue(value.value), optionValue, equalityKey) ? 0 : -1;
  }


  /**
   * The onclick handler for individual toggle buttons.
   */
  function handleToggleChange(option: unknown, pressed: boolean) {
    if (props.multiple) {
      const selectedIndex = getSelectedOptionIndex(option);
      const selectedItems = Array.isArray(value.value) ? [...value.value] : [];

      if (selectedIndex === -1) {
        selectedItems.push(getOptionValue(option));
      }
      else {
        selectedItems.splice(selectedIndex, 1);
      }

      value.value = selectedItems.length === 0 ? null : selectedItems;
    }
    else {
      value.value = pressed ? getOptionValue(option) : null;
    }

    emits('change', new ChangeEvent(value.value));
  }
</script>
