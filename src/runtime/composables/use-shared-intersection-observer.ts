import { toStableHash } from '@resee-movies/utilities/objects/to-stable-hash';
import { type MaybeElementRef, tryOnScopeDispose, unrefElement, watchOnce } from '@vueuse/core';
import { isRef, ref, type Ref } from 'vue';


/**
 * Options for an element that is being observed.
 */
export type UseSharedIntersectionObserverTargetOptions = {
  /**
   * A callback method that will fire each time the element's
   * intersecting state changes.
   */
  onChange?: (isIntersecting: boolean) => void;

  /**
   * If true, the element will only be observed until the first
   * time that its intersection state becomes true, at which
   * point it will be detached. This is particularly useful for
   * situations where rendering/events can be deferred until they
   * come into the viewport.
   */
  once?: boolean;
};

/**
 * Config for the {@link useSharedIntersectionObserver} composable.
 */
export type UseSharedIntersectionObserverOptions
  = UseSharedIntersectionObserverTargetOptions
    & IntersectionObserverInit;

/**
 * The return type of {@link useSharedIntersectionObserver}.
 */
export type UseSharedIntersectionObjectReturn = {
  isIntersecting : Ref<boolean>;
  stop           : () => void;
};

/**
 * A composable utility for interacting with an IntersectionObserver.
 *
 * The benefits of using this over utilizing observers directly is that this
 * method will reuse existing observers when possible - particularly useful
 * in heavy-use situations like custom image deferral, where a large
 * quantity of images would lead to a large quantity of IntersectionObserver
 * and possible performance degradation.
 */
export function useSharedIntersectionObserver(
  target : MaybeElementRef,
  options : UseSharedIntersectionObserverOptions = {},
): UseSharedIntersectionObjectReturn {
  const observer = getObserver(options);
  const isIntersecting = ref(true);

  // If IntersectionObserver is not supported, short-circuit here and
  // return something that defaults to true so whatever might have been
  // delayed by the observer behavior does occur.
  if (!observer) {
    return { isIntersecting, stop: () => undefined };
  }

  const elementState: UseSharedIntersectionObserverElementState = {
    isIntersecting : isIntersecting,
    onChange       : options.onChange,
    once           : options.once,
  };

  const stop = () => {
    removeObserver(target, observer);
  };

  if (isRef(target) && !target.value) {
    watchOnce(target, (el) => attachObserver(el, observer, elementState));
  }
  else {
    attachObserver(target, observer, elementState);
  }

  tryOnScopeDispose(() => {
    removeObserver(target, observer);
  });

  return { isIntersecting, stop };
}


/**
 * The internal state object for each Element that is being observed.
 */
type UseSharedIntersectionObserverElementState
  = UseSharedIntersectionObserverTargetOptions
    & { isIntersecting: Ref<boolean> };

/**
 * Adds the provided target element to a given observer, storing its
 * state in the process.
 */
function attachObserver(
  target : MaybeElementRef,
  observer : IntersectionObserver,
  options : UseSharedIntersectionObserverElementState,
) {
  const rawTarget = unrefElement(target);

  if (rawTarget && observer) {
    // The observer entry is set when the observer is created via `getObserver`.
    elementsMap.get(observer)?.set(rawTarget, options);
    observer.observe(rawTarget);
  }
}

/**
 * Removes the provided target element from the given observer, and cleans
 * up state.
 */
function removeObserver(target: Element | MaybeElementRef, observer: IntersectionObserver) {
  const rawTarget = target instanceof Element ? target : unrefElement(target);

  if (rawTarget && observer) {
    observer.unobserve(rawTarget);
    elementsMap.get(observer)?.delete(rawTarget);
  }
}

const observerMap = new Map<string, IntersectionObserver>();
const elementsMap = new WeakMap<IntersectionObserver, WeakMap<Element, UseSharedIntersectionObserverElementState>>();

/**
 * The internal callback for all IntersectionObserver instances that
 * are created in this module. The state of each participating element
 * is stored within a WeakMap.
 */
const observerCallback: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    const elementState = elementsMap.get(observer)?.get(entry.target);

    if (elementState) {
      elementState.isIntersecting.value = entry.isIntersecting;
      elementState.onChange?.(entry.isIntersecting);

      if (entry.isIntersecting && elementState.once) {
        removeObserver(entry.target, observer);
      }
    }
  });
};

/**
 * Retrieves an existing IntersectionObserver instance with the
 * provided configuration, or creates a new one.
 */
function getObserver(options: IntersectionObserverInit) {
  try {
    if (window && 'IntersectionObserver' in window) {
      const observerId = toStableHash(options);
      const observer   = observerMap.get(observerId) ?? new IntersectionObserver(observerCallback, options);

      observerMap.set(observerId, observer);

      if (!elementsMap.has(observer)) {
        elementsMap.set(observer, new WeakMap());
      }

      return observer;
    }
  }
  catch {
    /* noop */
  }

  return null;
}
