import {
  type ConfigurableWindow,
  defaultWindow,
  type MaybeComputedElementRef,
  type MaybeElement,
  noop,
  notNullish,
  type Pausable,
  toArray,
  tryOnScopeDispose,
  unrefElement,
  useSupported,
} from '@vueuse/core';
import { computed, type ComputedRef, type MaybeRefOrGetter, shallowRef, toValue, watch } from 'vue';


/**
 * @module
 *
 * This exists solely to support a dynamic `rootMargin` property. The capability will
 * land natively in Vueuse soon, at which time this can be dropped.
 */


export interface UseMutableIntersectionObserverOptions extends ConfigurableWindow {
  /**
   * Start the IntersectionObserver immediately on creation
   *
   * @default true
   */
  immediate?: boolean

  /**
   * The Element or Document whose bounds are used as the bounding box
   * when testing for intersection.
   */
  root?: MaybeComputedElementRef | Document

  /**
   * A string which specifies a set of offsets to add to the root's
   * bounding_box when calculating intersections.
   */
  rootMargin?: MaybeRefOrGetter<string>

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   * @default 0
   */
  threshold?: number | number[]
}

export interface UseMutableIntersectionObserverReturn extends Pausable {
  isSupported: ComputedRef<boolean>
  stop: () => void
}

/**
 * Detects that a target element's visibility.
 *
 * @see https://vueuse.org/useIntersectionObserver
 * @param target
 * @param callback
 * @param options
 */
export function useMutableIntersectionObserver(
  target   : MaybeComputedElementRef | MaybeRefOrGetter<MaybeElement[]> | MaybeComputedElementRef[],
  callback : IntersectionObserverCallback,
  options  : UseMutableIntersectionObserverOptions = {},
): UseMutableIntersectionObserverReturn {
  const {
    root,
    rootMargin,
    threshold = 0,
    window = defaultWindow,
    immediate = true,
  } = options

  const isSupported = useSupported(() => window && 'IntersectionObserver' in window)
  const targets = computed(() => {
    const _target = toValue(target)
    return toArray(_target).map(unrefElement).filter(notNullish)
  })

  let cleanup = noop
  const isActive = shallowRef(immediate)

  const stopWatch = isSupported.value
    ? watch(
      () => [targets.value, unrefElement(root as MaybeComputedElementRef), toValue(rootMargin), isActive.value] as const,
      ([targets, root, rootMargin]) => {
        cleanup()
        if (!isActive.value)
          return

        if (!targets.length)
          return

        const observer = new IntersectionObserver(
          callback,
          {
            root: unrefElement(root),
            rootMargin,
            threshold,
          },
        )

        targets.forEach(el => el && observer.observe(el))

        cleanup = () => {
          observer.disconnect()
          cleanup = noop
        }
      },
      { immediate, flush: 'post' },
    )
    : noop

  const stop = () => {
    cleanup()
    stopWatch()
    isActive.value = false
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    isActive,
    pause() {
      cleanup()
      isActive.value = false
    },
    resume() {
      isActive.value = true
    },
    stop,
  }
}
