import {
  useEventListener,
  useWindowScroll,
  type UseWindowScrollOptions,
  type UseWindowScrollReturn,
} from '@vueuse/core';
import { type Ref, ref } from 'vue';


const NavigationKeys = [
  'ArrowUp',
  'ArrowDown',
  ' ',
  'Spacebar',
  'ArrowRight',
  'ArrowLeft',
  'End',
  'Home',
  'PageDown',
  'PageUp',
];


export type UseReseeWindowScrollReturn = UseWindowScrollReturn & {
  source: Ref<Event | undefined>;
}


/**
 * A specialized implementation of the Vueuse {@link useWindowScroll} composable, which adds
 * the new property `source` to the returned object.
 *
 * The purpose of `source` is to provide a best-effort attempt at identifying _why_ the scroll
 * was initiated. To do this, a series of common user interaction events - _wheel_, _touchmove_,
 * etc. are listened to and correlated with the scroll event.
 *
 * In the case of a scroll **not** being initiated by direct user interaction - e.g. invocation of
 * `window.scrollTo` or the user agent scrolling the page in response to a URL hash change - then
 * `source` will be undefined.
 */
export function useReseeWindowScroll(options?: UseWindowScrollOptions): UseReseeWindowScrollReturn {
  const scrollSource = ref<Event>();

  let scrollEndTimeoutId: NodeJS.Timeout | number | undefined = undefined;

  function clearScrollEndTimeout() {
    if (scrollEndTimeoutId) {
      clearTimeout(scrollEndTimeoutId);
      scrollEndTimeoutId = undefined;
    }
  }

  function setScrollEndTimeout() {
    clearScrollEndTimeout();

    scrollEndTimeoutId = setTimeout(
      () => {
        scrollSource.value = undefined;
        scrollEndTimeoutId = undefined;
      },
      250,
    );
  }

  useEventListener(['wheel', 'touchmove', 'keydown', 'keyup', 'mousedown', 'mouseup'], (e) => {
    if (e instanceof KeyboardEvent) {
      if (NavigationKeys.includes(e.key)) {
        setScrollEndTimeout();
        scrollSource.value = e;
      }
    }
    else if(e.type === 'mouseup') {
      clearScrollEndTimeout();
      scrollSource.value = undefined;
    }
    else {
      setScrollEndTimeout();
      scrollSource.value = e;
    }
  });

  const scrollProps = useWindowScroll({
    ...options,

    onScroll(e) {
      options?.onScroll?.(e);
      clearScrollEndTimeout();
    },

    onStop(e) {
      options?.onStop?.(e);

      if (scrollSource.value?.type !== 'mousedown') {
        setScrollEndTimeout();
      }
    },
  });

  return { ...scrollProps, source: scrollSource };
}
