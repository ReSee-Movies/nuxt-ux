<template>
  <div :class="['scroller', { 'to-edge': props.toPageContainerEdge }]">
    <div ref="ruler" :class="props.rulerClasses" />

    <div
      ref    = "scrollBox"
      class  = "scroll-box styled-scroll transition-opacity duration-300"
      :class = "[
        props.scrollBoxClasses,
        {
          'opacity-0'      : !displayBounds.s0,
          'justify-start'  : displayBounds.s1 || !props.centerAlign,
          'justify-center' : !displayBounds.s1 || props.centerAlign,
        },
      ]"
    >
      <div
        v-if   = "slots.firstItem"
        ref    = "firstItem"
        :class = "[props.itemClasses, props.itemSizeClasses]"
      >
        <slot name="firstItem" />
      </div>

      <div
        v-for  = "(item, index) in props.items"
        ref    = "scrollItems"
        :key   = "identify(item, index)"
        :class = "[props.itemClasses, props.itemSizeClasses]"
      >
        <slot name="item" :item="item" :index="index" />
      </div>

      <div
        v-if   = "props.loading"
        :class = "[props.itemClasses, props.itemSizeClasses]"
      >
        <slot name="loading" />
      </div>

      <div
        v-if   = "slots.finalItem"
        ref    = "finalItem"
        :class = "[props.itemClasses, props.itemSizeClasses]"
      >
        <slot name="finalItem" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
  import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import { defaultWindow, useElementBounding, useDebounceFn, useScroll, watchDebounced } from '@vueuse/core';
  import { computed, ref, watch } from 'vue';
  import type { HTMLElementClassNames } from '../types';

  export type CardScrollerProps<T> = {
    items                : T[] | null | undefined;
    rulerClasses?        : HTMLElementClassNames;
    scrollBoxClasses?    : HTMLElementClassNames;
    itemClasses?         : HTMLElementClassNames;
    itemSizeClasses?     : HTMLElementClassNames;
    loading?             : boolean;
    centerAlign?         : boolean;
    toPageContainerEdge? : boolean;
    styleWhenTransiting? : 'left' | 'right' | 'both';
  };


  /**
   * An internal object containing various measurements of the scroll
   * container's size and boundary positions in relation to the page.
   *
   * - s0:   Indicates whether the "ruler" element is available.
   * - s1:   Indicates whether the inner container is overflowing the outer.
   *         E.g. is there something scrollable.
   * - x1:   The distance between the LEFT side of the viewport and the LEFT
   *         side of the scroll container.
   * - x2:   The distance between the left side of the viewport and the LEFT
   *         edge of the imaginary "padding box" of the scroll container, which
   *         is derived from the padding of the ruler element, and will be equal
   *         to `<x1> + <ruler left pad>`.
   * - x3:   The distance between the left side of the viewport and the RIGHT
   *         edge of the imaginary "padding box" of the scroll container, which
   *         is derived from the padding of the ruler element, and will be equal
   *         to `<x2> + <ruler inner width>`.
   * - x4:   The distance between the LEFT side of the viewport and the RIGHT
   *         side of the scroll container. It is equal to
   *         `<x3> + <ruler right pad>`.
   * - x1_2: The width of the LEFT padding of the imaginary "padding box" of
   *         the scroll container.
   * - x3_4: The width of the RIGHT padding of the imaginary "padding box" of
   *         the scroll container.
   */
  type DisplayBounds = {
    s0   : boolean;
    s1   : boolean;
    x1   : number;
    x2   : number;
    x3   : number;
    x4   : number;
    x1_2 : string;
    x3_4 : string;
  };
</script>


<script setup lang="ts" generic="T">
  const props = withDefaults(
    defineProps<CardScrollerProps<T>>(),
    {
      rulerClasses        : undefined,
      scrollBoxClasses    : undefined,
      itemClasses         : undefined,
      itemSizeClasses     : 'w-32 md:w-36 lg:w-42',
      loading             : false,
      centerAlign         : false,
      toPageContainerEdge : true,
      styleWhenTransiting : 'right',
    },
  );

  const slots = defineSlots<{
    item      : (slotProps: { item: T; index: number }) => unknown;
    firstItem : () => unknown;
    finalItem : () => unknown;
    loading   : () => unknown;
  }>();

  const ruler       = ref<HTMLDivElement>();
  const scrollBox   = ref<HTMLDivElement>();
  const scrollItems = ref<HTMLDivElement[]>([]);
  const firstItem   = ref<HTMLDivElement>();
  const finalItem   = ref<HTMLDivElement>();
  const rulerBounds = useElementBounding(ruler);


  /**
   * An array of HTMLDivElements. References to each immediate child "item"
   * of the scroll box.
   */
  const scrollItemElements = computed(() => {
    const result: HTMLDivElement[] = [];

    if (firstItem.value) {
      result.push(firstItem.value);
    }

    result.push(...scrollItems.value);

    if (finalItem.value) {
      result.push(finalItem.value);
    }

    return result;
  });


  /**
   * An object containing various measurements of the scroll
   * container's size and boundary positions in relation to the page.
   */
  const displayBounds = computed<DisplayBounds>(() => {
    const rulerEl = ruler.value;

    if (!rulerEl) {
      return { s0: false, s1: false, x1: 0, x2: 0, x3: 0, x4: 0, x1_2: '0px', x3_4: '0px' };
    }

    const rulerStyles    = defaultWindow?.getComputedStyle(rulerEl);
    const rulerLeft      = rulerBounds.left.value;
    const rulerWidth     = rulerBounds.width.value;
    const rulerPadLeft   = parseFloat(rulerStyles?.paddingLeft || '0');
    const rulerPadRight  = parseFloat(rulerStyles?.paddingRight || '0');
    const scrollBoxWidth = scrollBox.value?.scrollWidth ?? 0;

    const bounds = {
      s0 : true, // Has layout occurred
      s1 : rulerWidth < scrollBoxWidth, // Is the scroll box overflowing
      x1 : rulerLeft,
      x2 : rulerLeft + rulerPadLeft,
      x3 : rulerLeft + rulerPadLeft + rulerWidth,
      x4 : rulerLeft + rulerPadLeft + rulerWidth + rulerPadRight,
    } as DisplayBounds;

    bounds.x1_2 = `${ bounds.x2 - bounds.x1 }px`;
    bounds.x3_4 = `${ bounds.x4 - bounds.x3 }px`;

    return bounds;
  });


  /**
   * Reset the scroll position of the container when its size changes.
   */
  watchDebounced([displayBounds], () => {
    scrollBox.value?.scrollTo({ left: 0, behavior: 'instant' });
  }, { debounce: 500 });


  /**
   * Recompute the styles of scroll items when a scroll occurs or the size
   * of the container changes.
   *
   * There are two calls made in here: the first calls directly to `queueStyleChanges`,
   * which in turn sets up `requestAnimationFrame` to change the styles. The second
   * call is to a debounced wrapper around `queueStyleChanges`. It's been found that
   * it can take several frames for some browsers (tested in FF and Chrome) to settle
   * the final measurements of elements, so this last call performs a final pass when
   * everything had (hopefully) stabilized.
   */
  const scrollState = useScroll(scrollBox,);

  watch([scrollState.x, displayBounds], () => {
    queueStyleChanges();
    debouncedQueueStyleChanges();
  }, { flush: 'sync' });


  const debouncedQueueStyleChanges = useDebounceFn(() => queueStyleChanges(), 100);

  let queuedFrame: number | undefined = undefined;

  function queueStyleChanges() {
    if (queuedFrame) {
      cancelAnimationFrame(queuedFrame);
      queuedFrame = undefined;
    }

    queuedFrame = requestAnimationFrame(() => {
      applyStyleChanges();
      queuedFrame = undefined;
    });
  }


  function applyStyleChanges() {
    const styleLeft  = props.styleWhenTransiting === 'left' || props.styleWhenTransiting === 'both';
    const styleRight = props.styleWhenTransiting === 'right' || props.styleWhenTransiting === 'both';

    for (const element of scrollItemElements.value) {
      const [percentage, direction] = percentInBounds(element, displayBounds.value);

      if (direction === 'none') {
        element.style.opacity = '1';
        element.style.scale   = '1';
      }
      else if ((direction === 'left' && styleLeft) || (direction === 'right' && styleRight)) {
        element.style.opacity = percentage.toString();

        if (element.firstElementChild instanceof HTMLElement) {
          element.firstElementChild.style.transformOrigin = `center ${ direction === 'left' ? 'right' : 'left' }`;
          element.firstElementChild.style.scale           = (1 - (0.2 * (1 - percentage))).toString();
        }
      }
    }
  }


  /**
   * Calculate a % of how much within the visible viewport of the container the given
   * item is. Do note that an easing function is used, so the rate of change is not
   * linear.
   */
  function percentInBounds(
    element: HTMLElement,
    { x1, x2, x3, x4 }: DisplayBounds,
  ): [pecentage: number, direction: 'left' | 'right' | 'none'] {
    const {
      left  : elementStart,
      width : elementWidth,
    } = element.getBoundingClientRect();

    const elementEnd = elementStart + elementWidth;

    // Fully out of bounds to the left
    if (elementEnd <= x1) {
      return [0, 'left'];
    }

    // Fully out of bounds to the right
    if (elementStart >= x4) {
      return [0, 'right'];
    }

    // Fully in-bounds
    if (elementStart >= x2 && elementEnd <= x3) {
      return [1, 'none'];
    }

    // Transiting off to the left
    if (elementStart < x2) {
      return [easeInSine((elementEnd - x1) / (x2 - x1 + elementWidth)), 'left'];
    }

    // Transiting off to the right
    const stopA = x3 - elementWidth;
    const stopB = x4 - stopA;

    return [easeInSine(1 - ((elementStart - stopA) / stopB)), 'right'];
  }


  function easeInSine(t: number) {
    return roundHundredth(-1 * Math.cos(t * (Math.PI / 2)) + 1);
  }


  function roundHundredth(value: number) {
    return Math.round(value * 100) / 100;
  }


  function identify(item: T, fallback: string | number) {
    if (isObjectLike(item) && 'id' in item && isString(item.id)) {
      return item.id;
    }

    return fallback;
  }
</script>


<style scoped>
  @reference "tailwindcss";

  .scroller .scroll-box {
    scroll-padding-left  : v-bind('displayBounds.x1_2');
    scroll-padding-right : v-bind('displayBounds.x3_4');

    display           : flex;
    gap               : --spacing(3);
    width             : 100%;
    touch-action      : pan-x pan-y;
    overflow-x        : scroll;
    scroll-snap-type  : inline;
    padding-block-end : var(--page-column-gutter);

    @variant sm {
      gap: --spacing(4);
    }

    & > :deep(*) {
      flex-shrink       : 0;
      scroll-snap-align : start;
    }

    & > :deep(:first-child) {
      margin-left: v-bind('displayBounds.x1_2');
    }

    & > :deep(:last-child) {
      margin-right      : v-bind('displayBounds.x3_4');
      scroll-snap-align : end;
    }
  }

  .scroller.to-edge {
    margin-inline: calc(var(--page-column-gutter) * -1);

    & > :first-child {
      padding-inline: var(--page-column-gutter);
    }

    @variant sm {
      margin-inline: calc(var(--page-container-pad-x) * -1);

      & > :first-child {
        padding-inline: var(--page-container-pad-x);
      }
    }
  }
</style>
