<template>
  <div :class="{ pinned: !props.disabled }">
    <slot />
  </div>
</template>


<script lang="ts">
  export interface ScrollPinnedContainerProps {
    top?      : number;
    disabled? : boolean;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import { useGlobalHeaderStore } from '../stores/use-global-header-store';

  const props = withDefaults(
    defineProps<ScrollPinnedContainerProps>(),
    {
      top      : 24,
      disabled : false,
    },
  );

  const globalHeaderStore = useGlobalHeaderStore();

  const topOffset = computed(() => {
    if (props.disabled) {
      return 0;
    }

    return globalHeaderStore.isHeaderPulledDown
      ? globalHeaderStore.headerHeight + props.top
      : globalHeaderStore.subheaderHeight + props.top;
  });
</script>


<style scoped>
  .pinned {
    position                   : sticky;
    top                        : calc(v-bind(topOffset) * 1px);
    will-change                : top;
    transition-property        : top;
    transition-duration        : calc(var(--default-transition-duration) * 2);
    transition-timing-function : var(--default-transition-timing-function);
  }
</style>
