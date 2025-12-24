<template>
  <div ref="pinnedElement" class="pinned">
    <slot />
  </div>
</template>


<script lang="ts">
  export interface ScrollPinnedContainerProps {
    top?: number;
  }
</script>


<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useGlobalHeaderState } from '../composables/use-global-header-state';
  import { useMutableIntersectionObserver } from '../composables/use-mutable-intersection-observer';

  const props = withDefaults(
    defineProps<ScrollPinnedContainerProps>(),
    {
      top: 24,
    },
  );

  const pinnedElement = ref<HTMLElement>();
  const isPinned      = ref(false);

  const {
    headerHeight,
    subheaderHeight,
    isHeaderPulledDown,
  } = useGlobalHeaderState();

  const topOffset = computed(() => {
    return isHeaderPulledDown.value
      ? headerHeight.value + props.top
      : subheaderHeight.value + props.top;
  });


  useMutableIntersectionObserver(
    pinnedElement,
    (entries) => { isPinned.value = !entries[0]?.isIntersecting; },
    {
      rootMargin : () => `-${ topOffset.value + 1 }px`,
      threshold  : 1,
    },
  );
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
