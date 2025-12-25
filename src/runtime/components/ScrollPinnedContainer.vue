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
  import { useGlobalHeaderState } from '../composables/use-global-header-state';

  const props = withDefaults(
    defineProps<ScrollPinnedContainerProps>(),
    {
      top      : 24,
      disabled : false,
    },
  );

  const {
    headerHeight,
    subheaderHeight,
    isHeaderPulledDown,
  } = useGlobalHeaderState();

  const topOffset = computed(() => {
    if (props.disabled) {
      return 0;
    }

    return isHeaderPulledDown.value
      ? headerHeight.value + props.top
      : subheaderHeight.value + props.top;
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
