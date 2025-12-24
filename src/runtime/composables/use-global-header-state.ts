import { computed, ref } from 'vue';

/**
 * The height of the primary navbar at the top of the application.
 */
const headerHeight = ref(0);

/**
 * The height of the subheader portion of the top navbar, that remains
 * visible on scroll.
 */
const subheaderHeight = ref(0);

/**
 * Whether the header will behave like an opening drawer when scrolling
 * upward. Also see {@link isHeaderPulledDown} to determine if this
 * behavior is currently active.
 */
const isHeaderDrawerEnabled = ref(true);

/**
 * The state of the header when an upward scroll causes it to pull down into
 * to viewport.
 */
const isHeaderPulledDown = ref(false);

/**
 * Apply these CSS styles to the `styles` attribute of a container that you
 * want to push up underneath the fixed site header. A negative top margin
 * equal to the height of the header is applied, as is a positive top
 * padding of the same amount.
 */
const offsetFromHeaderStyles = computed(() => {
  return [
    `margin-top: -${ headerHeight.value }px;`,
    `padding-top: ${ headerHeight.value }px;`,
  ];
});


/**
 * Stateful information about the GlobalHeader component.
 */
export function useGlobalHeaderState() {
  return {
    headerHeight,
    subheaderHeight,
    isHeaderDrawerEnabled,
    isHeaderPulledDown,
    offsetFromHeaderStyles,
  };
}
