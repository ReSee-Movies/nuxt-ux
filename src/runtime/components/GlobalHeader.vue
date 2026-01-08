<template>
  <div ref="rulerElement" :class="{ placeholder: isHeaderAffixed }" />

  <header
    ref    = "headerElement"
    v-bind = "$attrs"
    :class = "{
      'header-affixed' : isHeaderAffixed,
      'header-transit' : doTransitions,
      'header-hidden'  : hideDrawerContent,
    }"
  >
    <div ref="drawerElement">
      <LayoutPageColumn>
        <slot name="default" />
      </LayoutPageColumn>

      <div
        v-if  = "renderSubheader"
        class = "border-b border-b-global-background-accent"
      />
    </div>

    <div v-if="renderSubheader" ref="subheadElement" class="subheader">
      <LayoutPageColumn class="overflow-x-auto styled-scroll">
        <slot name="subheader">
          <TableOfContents
            :toc       = "props.subheaderToc ?? headerState.subheaderToc.value"
            class      = "flex items-center flex-nowrap"
            link-class = "btn small borderless text-nowrap"
            :min-depth = "2"
            :max-depth = "2"
          />
        </slot>
      </LayoutPageColumn>
    </div>
  </header>
</template>


<script lang="ts">
  import type { TableOfContentsItem } from './TableOfContents.vue';

  export interface GlobalHeaderProps {
    /**
     * Whether the header will act like a flyout drawer when
     * scrolling upward on the page.
     */
    drawer?: boolean;

    /**
     * Table of contents objects for the global subheader which
     * will be turned into anchor links.
     */
    subheaderToc?: TableOfContentsItem[];
  }
</script>


<script setup lang="ts">
  import { useHead } from '#imports';
  import { computed, ref, useSlots, watch } from 'vue';
  import { useElementSize } from '@vueuse/core';
  import { useGlobalHeaderState } from '../composables/use-global-header-state';
  import { useReseeWindowScroll } from '../composables/use-resee-window-scroll';
  import { useTwoFrameRefToggle } from '../composables/use-two-frame-ref-toggle';
  import LayoutPageColumn from './LayoutPageColumn.vue';
  import TableOfContents from './TableOfContents.vue';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<GlobalHeaderProps>(),
    {
      drawer         : true,
      subheaderItems : undefined,
    },
  );

  const slots = useSlots();

  const rulerElement   = ref<HTMLElement>();
  const headerElement  = ref<HTMLElement>();
  const drawerElement  = ref<HTMLElement>();
  const subheadElement = ref<HTMLElement>();

  const { height: headerHeight }  = useElementSize(headerElement);
  const { height: drawerHeight }  = useElementSize(drawerElement);
  const { height: subheadHeight } = useElementSize(subheadElement);

  const {
    y      : windowScrollY,
    source : windowScrollSource,
  } = useReseeWindowScroll();

  const [isHeaderAffixed, doTransitions, updateAffixState] = useTwoFrameRefToggle();
  const hideDrawerContent = ref(false);

  const headerState = useGlobalHeaderState();

  const renderSubheader = computed(() => {
    return !!(slots.subheader || props.subheaderToc?.length || headerState.subheaderToc.value?.length);
  });

  useHead({
    bodyAttrs: {
      style: () => ({
        '--extra-scroll-margin': subheadHeight.value ? `${ subheadHeight.value }px` : '',
      }),
    },
  });


  // --------------------------
  // Scroll Watcher
  // --------------------------
  let backscrollCounter = 0;

  function disableAffix() {
    updateAffixState(false);
    hideDrawerContent.value = false;
    backscrollCounter = 0;
  }

  function enableAffix() {
    updateAffixState(true);
    hideDrawerContent.value = true;
  }

  const { pause, resume } = watch(windowScrollY, (newScrollY, oldScrollY) => {
    const scrollCeiling   = rulerElement.value?.offsetTop ?? 0;
    const rawDrawerHeight = drawerHeight.value;

    if (newScrollY <= scrollCeiling || (newScrollY <= (scrollCeiling + rawDrawerHeight) && hideDrawerContent.value)) {
      return disableAffix();
    }

    if (!isHeaderAffixed.value && newScrollY > (scrollCeiling + rawDrawerHeight)) {
      return enableAffix();
    }

    // If the scroll was initiated by a non-user interaction, then we don't want to
    // consider its delta in whether the header should be displayed.
    if (!windowScrollSource.value) {
      hideDrawerContent.value = true;
      backscrollCounter       = 0;
      return;
    }

    const scrollDelta     = newScrollY - oldScrollY;
    const isScrollDown    = scrollDelta > 0;
    const negDrawerHeight = rawDrawerHeight * -1;

    backscrollCounter = isScrollDown
      ? Math.min(rawDrawerHeight, backscrollCounter + scrollDelta)
      : Math.max(negDrawerHeight, backscrollCounter + scrollDelta);

    if (backscrollCounter === rawDrawerHeight) {
      hideDrawerContent.value = true;
    }
    else if (backscrollCounter === negDrawerHeight) {
      hideDrawerContent.value = false;
    }
  });


  // --------------------------
  // Provide External State
  // --------------------------
  watch(
    [() => props.drawer, headerHeight, subheadHeight, hideDrawerContent, isHeaderAffixed],
    () => {
      if (props.drawer) {
        resume();
      }
      else {
        pause();
        disableAffix();
      }

      headerState.isHeaderDrawerEnabled.value = props.drawer;
      headerState.headerHeight.value          = headerHeight.value;
      headerState.subheaderHeight.value       = subheadHeight.value;
      headerState.isHeaderPulledDown.value    = isHeaderAffixed.value && !hideDrawerContent.value;
    },
    { immediate: true },
  );
</script>


<style scoped>
  .placeholder {
    height: calc(v-bind(headerHeight) * 1px);
  }

  header {
    position : relative;
    z-index  : 100;
    transition-property        : box-shadow;
    transition-duration        : calc(var(--default-transition-duration) * 2);
    transition-timing-function : var(--default-transition-timing-function);
  }

  .header-affixed {
    position   : fixed;
    top        : 0;
    left       : 0;
    right      : var(--p-scrollbar-width, 0);
    transform  : translateY(0px);
    box-shadow : var(--shadow-heavy);

    &.header-transit {
      transition-property: transform, box-shadow;
    }

    &.header-hidden {
      transform  : translateY(calc(v-bind(drawerHeight) * -1px));
      box-shadow : none;
    }
  }

  .subheader {
    :deep(.btn) {
      background                 : transparent;
      transition                 : background-color;
      transition-duration        : var(--default-transition-duration);
      transition-timing-function : var(--default-transition-timing-function);

      &.active {
        background: var(--color-global-background-accent);
      }
    }
  }
</style>
