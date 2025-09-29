<template>
  <span :class="['pair', props.layout]">
    <UiIcon
      v-if  = "leadingIconName"
      :name = "leadingIconName"
    />

    <span>
      <slot>
        {{ props.text }}
      </slot>
    </span>

    <UiIcon
      v-if  = "props.trailingIcon"
      :name = "props.trailingIcon"
    />
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      text?         : string;
      icon?         : string;
      leadingIcon?  : string;
      trailingIcon? : string;
      layout?       : 'column' | 'row';
    }>(),
    {
      text         : undefined,
      icon         : undefined,
      leadingIcon  : undefined,
      trailingIcon : undefined,
    },
  );

  const leadingIconName = computed(() => {
    return props.icon || props.leadingIcon;
  });
</script>

<style scoped>
  .pair {
    display     : inline-flex;
    gap         : calc(var(--spacing) * 1);
    align-items : baseline;

    &.row {
      display: flex;
    }

    &.column {
      flex-direction : column;
      align-items    : center;
    }
  }
</style>
