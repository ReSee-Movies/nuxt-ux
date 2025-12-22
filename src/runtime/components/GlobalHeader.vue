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
      <slot />
    </div>

    <div v-if="slots.subheader">
      <slot name="subheader" />
    </div>
  </header>
</template>


<script lang="ts">
  export interface GlobalHeaderProps {
    /* Whether the header will act like a flyout drawer when scrolling upward on the page. */
    drawer?: boolean;
  }
</script>


<script setup lang="ts">
  import { ref, useSlots, watch } from 'vue';
  import { useElementSize, useWindowScroll } from '@vueuse/core';
  import { useGlobalHeaderState } from '../composables/use-global-header-state';
  import { useTwoFrameRefToggle } from '../composables/use-two-frame-ref-toggle';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<GlobalHeaderProps>(),
    {
      drawer: true,
    },
  );

  const slots = useSlots();

  const rulerElement  = ref<HTMLElement>();
  const headerElement = ref<HTMLElement>();
  const drawerElement = ref<HTMLElement>();

  const { height: headerHeight } = useElementSize(headerElement);
  const { height: drawerHeight } = useElementSize(drawerElement);
  const { y: windowScrollY }     = useWindowScroll();

  const [isHeaderAffixed, doTransitions, updateAffixState] = useTwoFrameRefToggle();
  const hideDrawerContent = ref(false);


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
  const headerState = useGlobalHeaderState();

  watch(
    [() => props.drawer, headerHeight, hideDrawerContent, isHeaderAffixed],
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
      headerState.isHeaderPulledDown.value    = isHeaderAffixed.value && !hideDrawerContent.value;
    },
    { immediate: true },
  );
</script>


<style scoped>
  .placeholder {
    height: calc(v-bind(headerHeight) * 1px);
  }

  .header-affixed {
    position   : fixed;
    top        : 0;
    left       : 0;
    right      : 0;
    transform  : translateY(0px);
    box-shadow : var(--shadow-heavy);

    &.header-transit {
      transition-property        : transform, box-shadow;
      transition-duration        : calc(var(--default-transition-duration) * 2);
      transition-timing-function : var(--default-transition-timing-function);
    }

    &.header-hidden {
      transform  : translateY(calc(v-bind(drawerHeight) * -1px));
      box-shadow : none;
    }
  }
</style>
