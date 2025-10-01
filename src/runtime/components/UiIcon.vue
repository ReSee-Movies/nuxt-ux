<template>
  <Transition name="fade" mode="out-in">
    <UiLoadingIndicator v-if="props.loading" :size="props.size" class="icon" />
    <span v-else role="presentation" :class="['icon', props.name, props.size]" />
  </Transition>
</template>

<script lang="ts">
  export type UiIconProps = {
    name?    : string;
    loading? : boolean;
    size?    : 'sm' | 'md' | 'lg' | 'xl';
  };
</script>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<UiIconProps>(),
    {
      name    : undefined,
      loading : false,
      size    : 'md',
    },
  );
</script>

<style scoped>
  .icon {
    display     : inline-flex;
    align-items : center;

    &:before {
      content: var(--zero-width-space);
    }

    &.sm {
      font-size: var(--icon-size-small);
    }

    &.md {
      font-size: var(--icon-size-medium);
    }

    &.lg {
      font-size: var(--icon-size-large);
    }

    &.xl {
      font-size: var(--icon-size-jumbo);
    }
  }
</style>
