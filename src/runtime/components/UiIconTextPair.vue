<template>
  <span
    :class="[
      'pair',
      props.layout ? `layout-${ props.layout }` : undefined,
      props.spacing ? `spacing-${ props.spacing }` : undefined,
    ]"
  >
    <UiIcon
      v-if     = "props.icon || props.loading"
      :name    = "props.icon"
      :size    = "props.iconSize"
      :loading = "props.loading"
    />

    <span v-if="props.text || slots.default" class="label">
      <slot>
        {{ props.text }}
      </slot>
    </span>

    <UiIcon
      v-if  = "props.trailingIcon"
      :name = "props.trailingIcon"
      :size = "props.iconSize"
    />
  </span>
</template>

<script lang="ts">
  import { useSlots } from 'vue';
  import type { UiIconProps } from './UiIcon.vue';

  export type UiIconTextPairProps = {
    text?             : string;
    icon?             : string;
    trailingIcon?     : string;
    iconSize?         : UiIconProps['size'];
    trailingIconSize? : UiIconProps['size'];
    layout?           : 'column' | 'row';
    spacing?          : 'wide' | 'normal';
    loading?          : boolean;
  };
</script>

<script setup lang="ts">
  import UiIcon from './UiIcon.vue';

  const props = withDefaults(
    defineProps<UiIconTextPairProps>(),
    {
      text             : undefined,
      icon             : undefined,
      trailingIcon     : undefined,
      iconSize         : 'md',
      trailingIconSize : 'md',
      layout           : undefined,
      spacing          : undefined,
      loading          : false,
    },
  );

  const slots = useSlots();
</script>

<style scoped>
  @reference "tailwindcss";

  .pair {
    display     : inline-flex;
    gap         : --spacing(1);
    align-items : baseline;

    &.spacing-wide {
      gap: --spacing(2);
    }

    &.layout-row {
      display: flex;
    }

    &.layout-column {
      flex-direction : column;
      align-items    : center;
    }
  }
</style>
