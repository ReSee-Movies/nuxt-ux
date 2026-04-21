import {
  type MaybeRefOrGetter,
  toValue,
  watchEffect,
  watch,
  type Ref,
  type WritableComputedRef,
  computed,
  shallowRef,
  onScopeDispose,
  type ComputedRef,
  type WatchHandle,
} from 'vue';
import { useDebouncedSyncRef, type UseDebouncedSyncRefOptions, type Side } from './use-debounced-sync-ref';


export type SyncObject = Record<string | number | symbol, unknown>;

export type KeyOf<S extends SyncObject> = keyof S;

export type KeyOfSide<
  S extends Side,
  L extends SyncObject,
  R extends SyncObject,
> = S extends 'left' ? KeyOf<L> : KeyOf<R>;

export type Getter<S extends SyncObject> = <R>(obj: S, key: KeyOf<S>) => R;

export type Setter<S extends SyncObject> = (obj: S, key: KeyOf<S>, value: unknown) => void;


export type ComputedReadWriteOptions<S extends SyncObject> = {
  getter? : Getter<S>;
  setter? : Setter<S>;
};

export type UseReactiveObjectsSyncOptions<
  L extends SyncObject,
  R extends SyncObject,
> = {
  left          : MaybeRefOrGetter<L | undefined>;
  right         : MaybeRefOrGetter<R | undefined>;
  keySource?    : Side | (KeyOf<L> | KeyOf<R>)[];
  onChange?     : <S extends Side>(side: S, key: KeyOfSide<S, L, R>, value: unknown) => void;
  onWillChange? : <S extends Side>(side: S, key: KeyOfSide<S, L, R>, value: unknown) => void;
  leftOptions?  : ComputedReadWriteOptions<L>;
  rightOptions? : ComputedReadWriteOptions<R>;
} & Omit<UseDebouncedSyncRefOptions, 'onChange' | 'onWillChange'>;

type SyncHandle = {
  leftRef  : WritableComputedRef<unknown>;
  rightRef : WritableComputedRef<unknown>;
  stopSync : () => void;
};

type UseReactiveObjectsSyncReturn = {
  stop(): void;
};


/**
 * Provides two-way binding between a pair of reactive objects.
 */
export function useReactiveObjectsSync<
  L extends SyncObject,
  R extends SyncObject,
>(
  options: UseReactiveObjectsSyncOptions<L, R>,
): UseReactiveObjectsSyncReturn {
  const { left, right } = options;

  const {
    aggregatedKeys,
    watchHandles,
  } = aggregateKeys(options);

  const syncHandles = new Map<KeyOf<L> | KeyOf<R>, SyncHandle>();

  const stopWatchersFn = () => {
    watchHandles.forEach((handle) => handle.stop());
    syncHandles.forEach((handle) => handle.stopSync());
  };

  onScopeDispose(() => {
    stopWatchersFn();
  });

  const handle = watch(aggregatedKeys, (newKeys, oldKeys) => {
    // Remove old keys
    for (const key of oldKeys.difference(newKeys)) {
      const handle = syncHandles.get(key);

      if (handle) {
        syncHandles.delete(key);
        handle.stopSync();
      }
    }

    // Add new keys
    for (const key of newKeys) {
      if (syncHandles.has(key)) {
        continue;
      }

      const leftRef  = computedReadWrite(left, key, options?.leftOptions);
      const rightRef = computedReadWrite(right, key, options?.rightOptions);

      const handles = useDebouncedSyncRef(leftRef, rightRef, {
        direction     : options?.direction,
        debounceMs    : options?.debounceMs,
        debounceMsLtr : options?.debounceMsLtr,
        debounceMsRtl : options?.debounceMsRtl,

        onWillChange(side, value) {
          options?.onWillChange?.(side, key, value);
        },

        onChange(side, value) {
          options?.onChange?.(side, key, value);
        },
      });

      syncHandles.set(key, { leftRef, rightRef, stopSync: handles.stop });
    }
  });

  watchHandles.push(handle);

  return {
    stop: stopWatchersFn,
  };
}


/**
 * Returns an array ref that keeps up-to-date with the enumerable property
 * names of the provided reactive object.
 */
function objectKeysRef<
  S extends SyncObject,
>(
  source: MaybeRefOrGetter<S | undefined>,
): {
  keys   : Ref<KeyOf<S>[]>;
  handle : WatchHandle;
} {
  const keys = shallowRef<KeyOf<S>[]>([]);

  const handle = watchEffect(() => {
    const value = toValue(source);
    keys.value = value ? Object.keys(value) : [];
  });

  return { keys, handle };
}


/**
 * Aggregate the keys from the left and right objects, based on the provided
 * configuration of `keySource`.
 */
function aggregateKeys<
  L extends SyncObject,
  R extends SyncObject,
>(
  options: UseReactiveObjectsSyncOptions<L, R>,
): {
  aggregatedKeys : ComputedRef<Set<KeyOf<L> | KeyOf<R>>>;
  watchHandles   : WatchHandle[];
} {
  const leftValues = (!options.keySource || options.keySource === 'left')
    ? objectKeysRef(options.left)
    : undefined;

  const rightValues = (!options.keySource || options.keySource === 'right')
    ? objectKeysRef(options.right)
    : undefined;

  const aggregatedKeys = computed(() => {
    if (Array.isArray(options.keySource)) {
      return new Set(options.keySource);
    }

    return new Set(
      [...(leftValues?.keys.value ?? []), ...(rightValues?.keys.value ?? [])],
    );
  });

  const watchHandles = [
    leftValues?.handle,
    rightValues?.handle,
  ].filter((entry) => !!entry);

  return { aggregatedKeys, watchHandles };
}


/**
 * Creates a read/writable computed instance for interacting with the property
 * of name `key` on the reactive `source` object. Optional `getter` and `setter`
 * methods can be provided to further augment behavior.
 */
function computedReadWrite<S extends SyncObject>(
  source : MaybeRefOrGetter<S | undefined>,
  key : KeyOf<S>,
  options? : ComputedReadWriteOptions<S>,
) {
  return computed({
    get() {
      const target = toValue(source);

      if (target) {
        return options?.getter ? options.getter(target, key) : target[key];
      }

      return undefined;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(val: any) {
      const target = toValue(source);

      if (target) {
        if (options?.setter) {
          options.setter(target, key, val);
        }
        else {
          target[key] = val;
        }
      }
    },
  });
}
