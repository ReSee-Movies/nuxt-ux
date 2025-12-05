<template>
  <Button
    :text         = "currentText"
    :icon         = "currentIcon"
    :aria-pressed = "pressed"
    @click        = "handleClick"
  >
    <template #default v-if="slots.default">
      <slot />
    </template>
  </Button>
</template>


<script lang="ts">
  import type { ButtonProps } from './Button.vue';

  export interface ToggleButtonProps extends /* @vue-ignore */ Omit<ButtonProps, 'onClick' | 'trailingIcon' | 'trailingIconSize'> {
    onIcon?  : string;
    offIcon? : string;
    onText?  : string;
    offText? : string;
  }
</script>


<script setup lang="ts">
  import { computed, useSlots, watch } from 'vue';
  import Button from './Button.vue';

  const props = withDefaults(
    defineProps<ToggleButtonProps>(),
    {
      onIcon  : undefined,
      offIcon : undefined,
      onText  : undefined,
      offText : undefined,
    },
  );

  const emits = defineEmits<{
    (e: 'click', pressed: boolean): void;
    (e: 'change', pressed: boolean): void,
  }>();

  const pressed = defineModel<boolean>('pressed', { default: false });

  const slots = useSlots();

  const currentText = computed(() => {
    return pressed.value ? (props.onText ?? props.text) : (props.offText ?? props.text);
  });

  const currentIcon = computed(() => {
    return pressed.value ? (props.onIcon ?? props.icon) : (props.offIcon ?? props.icon);
  });

  watch(pressed, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      emits('change', newVal);
    }
  });

  function handleClick() {
    pressed.value = !pressed.value;
    emits('click', pressed.value);
  }
</script>
