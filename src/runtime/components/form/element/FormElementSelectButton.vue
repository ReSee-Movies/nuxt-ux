<template>
  <div
    role              = "group"
    class             = "input-group input-button-bar"
    :aria-labelledby  = "props.ariaLabelledby"
    :aria-describedby = "props.ariaDescribedby"
  >
    <template v-for="(option, index) of props.options" :key="utils.getOptionRenderKey(option) ?? index">
      <ToggleButton
        class       = "input-button"
        severity    = "unset"
        :pressed    = "utils.getOptionIndex(option, value) !== -1"
        :text       = "props.iconOnly ? undefined : utils.getOptionLabel(option)"
        :icon       = "utils.getOptionIcon(option)"
        :disabled   = "getOptionDisabled(option)"
        :aria-label = "props.iconOnly ? utils.getOptionLabel(option) : undefined"
        :tooltip    = "props.iconOnly ? utils.getOptionLabel(option) : undefined"
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
  import { useOptionListMethods } from '../../../utils/form';
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
  const utils = useOptionListMethods(props);


  function getOptionDisabled(option: unknown): boolean {
    // The entire control, or the individual option, is explicitly disabled
    if (props.disabled || props.readonly || utils.value.getOptionDisabled(option)) {
      return true;
    }

    // The control's selection limit has been reached,
    // and the given option is not in the list
    if (props.multiple) {
      const limit  = props.selectionLimit ?? Number.POSITIVE_INFINITY;
      const length = Array.isArray(value.value) ? value.value.length : 0;

      if (limit <= length && utils.value.getOptionIndex(option, value) === -1) {
        return true;
      }
    }

    return false;
  }


  function handleToggleChange(option: unknown, pressed: boolean) {
    if (props.multiple) {
      const selectedIndex = utils.value.getOptionIndex(option, value);
      const selectedItems = Array.isArray(value.value) ? [...value.value] : [];

      if (selectedIndex === -1) {
        selectedItems.push(utils.value.getOptionValue(option));
      }
      else {
        selectedItems.splice(selectedIndex, 1);
      }

      value.value = selectedItems.length === 0 ? null : selectedItems;
    }
    else {
      value.value = pressed ? utils.value.getOptionValue(option) : null;
    }

    emits('change', new ChangeEvent(value.value));
  }
</script>
