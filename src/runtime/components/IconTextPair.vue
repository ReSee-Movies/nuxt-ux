<template>
  <span :class="['pair', props.spacing ? `spacing-${ props.spacing }` : undefined]">
    <Icon
      class                 = "leading-icon"
      :name                 = "props.icon"
      :size                 = "props.iconSize"
      :loading              = "props.loading"
      :transition-name      = "props.iconTransitionName"
      :transition-mode      = "props.iconTransitionMode"
      :transition-on-appear = "props.iconTransitionOnAppear"
    />

    <span v-if="props.text || slots.default" class="label">
      <slot>
        {{ props.text }}
      </slot>
    </span>

    <Icon
      v-if                  = "props.trailingIcon"
      class                 = "trailing-icon"
      :name                 = "props.trailingIcon"
      :size                 = "props.iconSize"
      :transition-name      = "props.iconTransitionName"
      :transition-mode      = "props.iconTransitionMode"
      :transition-on-appear = "props.iconTransitionOnAppear"
    />
  </span>
</template>

<script lang="ts">
  import { useSlots } from 'vue';
  import type { IconProps } from './Icon.vue';

  export interface IconTextPairProps {
    text?                   : string;
    icon?                   : string;
    trailingIcon?           : string;
    iconSize?               : IconProps['size'];
    trailingIconSize?       : IconProps['size'];
    spacing?                : 'wide' | 'normal' | 'none';
    loading?                : boolean;
    iconTransitionName?     : IconProps['transitionName'];
    iconTransitionMode?     : IconProps['transitionMode'];
    iconTransitionOnAppear? : IconProps['transitionOnAppear'];
  }
</script>

<script setup lang="ts">
  import Icon from './Icon.vue';

  const props = withDefaults(
    defineProps<IconTextPairProps>(),
    {
      text                   : undefined,
      icon                   : undefined,
      trailingIcon           : undefined,
      iconSize               : 'md',
      trailingIconSize       : 'md',
      layout                 : undefined,
      spacing                : undefined,
      loading                : false,
      iconTransitionName     : undefined,
      iconTransitionMode     : undefined,
      iconTransitionOnAppear : false,
    },
  );

  const slots = useSlots();
</script>

<style scoped>
  @reference "tailwindcss";

  /**
   * We are intentionally targeting the immediate child of the icon component
   * to apply a margin to so that the icon can animated in/out via its size
   * and that extra bit of space included.
   */

  .pair {
    --element-spacing: --spacing(1);

    display     : inline;
    align-items : baseline;

    &.spacing-none {
      --element-spacing: 0;
    }

    &.spacing-wide {
      --element-spacing: --spacing(2);
    }

    .leading-icon > * {
      margin-inline-end: var(--element-spacing);
    }

    .trailing-icon > * {
      margin-inline-start: var(--element-spacing);
    }
  }
</style>
