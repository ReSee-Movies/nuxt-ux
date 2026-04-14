import { watchDebounced } from '@vueuse/core';
import type { Ref, WatchHandle, WatchOptions } from 'vue';

export type Side = 'left' | 'right';

/**
 * Configuration for the {@link useDebouncedSyncRef} composable.
 */
export type UseDebouncedSyncRefOptions<L = unknown, R = unknown> = WatchOptions & {
  direction?     : 'both' | Side;
  debounceMs?    : number;
  debounceMsLtr? : number;
  debounceMsRtl? : number;
  onChange?      : <S extends Side>(side: S, value: S extends 'left' ? L : R) => void;
};


/**
 * Two-way refs synchronization, with the option to debounce changes going
 * in each direction.
 *
 * This is a simplified version of the Vueuse `syncRef` utility.
 * @see https://vueuse.org/shared/syncRef/
 */
export function useDebouncedSyncRef<L, R>(left: Ref<L>, right: Ref<R>, options?: UseDebouncedSyncRefOptions<L, R>) {
  const watchers = [] as WatchHandle[];
  const stop     = () => watchers.forEach((handle) => handle.stop());
  const pause    = () => watchers.forEach((handle) => handle.pause());
  const resume   = () => watchers.forEach((handle) => handle.resume());

  const watchOptions = {
    flush     : options?.flush ?? 'sync',
    deep      : options?.deep ?? false,
    immediate : options?.immediate ?? false,
  };

  const syncDirection = options?.direction ?? 'both';
  const debounceLeft  = options?.debounceMsLtr ?? options?.debounceMs ?? 0;
  const debounceRight = options?.debounceMsRtl ?? options?.debounceMs ?? 0;

  /**
   * We're manually gating the left/right watchers, instead of using `pause()` and `resume()`
   * because unlike the Vueuse `watchPausable` version of those methods which result in any
   * updates being ignored, Vue's native `watch` handles queues those changes for whenever
   * `resume()` is called.
   */

  let ignoreLeft  = false;
  let ignoreRight = false;

  if (syncDirection === 'both' || syncDirection === 'left') {
    watchers.push(watchDebounced(
      left,
      (newValue) => {
        if (ignoreLeft) {
          ignoreLeft = false;
          return;
        }

        ignoreRight = true;
        right.value = newValue as unknown as R;

        options?.onChange?.('right', right.value);
      },
      { ...watchOptions, debounce: debounceLeft },
    ));
  }

  if (syncDirection === 'both' || syncDirection === 'right') {
    watchers.push(watchDebounced(
      right,
      (newValue) => {
        if (ignoreRight) {
          ignoreRight = false;
          return;
        }

        ignoreLeft = true;
        left.value = newValue as unknown as L;

        options?.onChange?.('left', left.value);
      },
      { ...watchOptions, debounce: debounceRight },
    ));
  }

  return { stop, pause, resume };
}
