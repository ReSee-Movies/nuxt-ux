import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { TableOfContentsItem } from '../components/TableOfContents.vue';


/**
 * Stateful information about the application's GlobalHeader component.
 */
export const useGlobalHeaderStore = defineStore('global-header', () => {
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
   * Table of content entries for the global subheader. This ref should not be
   * used directly. Instead, use the {@link tableOfContents} method that is
   * returned by {@link useGlobalHeaderStore}.
   *
   * @experimental
   */
  const subheaderToc = ref<TableOfContentsItem[]>([]);


  /**
   * Add table of content items to the global subheader.
   *
   * @experimental
   */
  function tableOfContents(toc: TableOfContentsItem[] | undefined) {
    subheaderToc.value = toc ?? [];
  }

  return {
    headerHeight,
    subheaderHeight,
    isHeaderDrawerEnabled,
    isHeaderPulledDown,
    offsetFromHeaderStyles,
    subheaderToc,
    tableOfContents,
  };
});

// @ts-expect-error - "hot" is not defined
import.meta.hot?.accept(acceptHMRUpdate(useGlobalHeaderStore, import.meta.hot));
