<template>
  <div
    ref    = "container"
    :class = "{
      'scroll-pinned-container'   : !props.disabled,
      'full-height styled-scroll' : props.fullHeight,
    }"
  >
    <slot />
  </div>
</template>


<script lang="ts">
  export interface ScrollPinnedContainerProps {
    defaultTopOffset? : number;
    disabled?         : boolean;
    fullHeight?       : boolean;
  }
</script>


<script setup lang="ts">
  import { useElementBounding } from '@vueuse/core';
  import { computed, ref } from 'vue';
  import { useGlobalHeaderStore } from '../stores/use-global-header-store';

  const props = withDefaults(
    defineProps<ScrollPinnedContainerProps>(),
    {
      defaultTopOffset : 24,
      disabled         : false,
      fullHeight       : false,
    },
  );

  const container   = ref<HTMLElement>();
  const headerStore = useGlobalHeaderStore();
  const boundingBox = useElementBounding(container, { updateTiming: 'next-frame' });

  const containerTopOffset = computed(() => {
    if (props.disabled) {
      return 0;
    }

    return headerStore.isHeaderPulledDown
      ? headerStore.headerHeight + props.defaultTopOffset
      : headerStore.subheaderHeight + props.defaultTopOffset;
  });

  const containerHeight = computed(() => {
    if (props.disabled || !props.fullHeight) {
      return { size: 'initial', timing: '0ms' };
    }

    const pinnedOffset   = containerTopOffset.value + props.defaultTopOffset;
    const staticOffset   = boundingBox.top.value + props.defaultTopOffset;
    const relevantOffset = Math.max(pinnedOffset, staticOffset);

    return {
      size   : `calc(100vh - ${ relevantOffset }px)`,
      timing : relevantOffset === pinnedOffset ? 'calc(var(--default-transition-duration) * 2)' : '0ms',
    };
  });
</script>


<style scoped>
  .scroll-pinned-container {
    position                   : sticky;
    top                        : calc(v-bind(containerTopOffset) * 1px);
    height                     : v-bind(containerHeight.size);
    transition-property        : top, height;
    transition-duration        : calc(var(--default-transition-duration) * 2), v-bind(containerHeight.timing);
    transition-timing-function : var(--default-transition-timing-function);

    &.full-height {
      overflow-y       : auto;
      scrollbar-gutter : stable;
    }
  }
</style>
