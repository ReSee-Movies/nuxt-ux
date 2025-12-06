import { syncRef } from '@vueuse/core';
import {
  type MaybeRefOrGetter,
  toValue,
  watchEffect,
  watch,
  type Ref,
  type WritableComputedRef,
  computed,
  shallowRef,
  type ComputedRef,
} from 'vue';


export type SyncObject = Record<string | number | symbol, unknown>;

export type KeyOf<S extends SyncObject> = keyof S;

export type Getter<S extends SyncObject> = <R>(obj: S | undefined, key: KeyOf<S>) => R;

export type Setter<S extends SyncObject> = (val: unknown, obj: S | undefined, key: KeyOf<S>) => void;

export type Side = 'left' | 'right';

export type SyncHandle = {
  leftRef  : WritableComputedRef<unknown>;
  rightRef : WritableComputedRef<unknown>;
  stopSync : () => void;
};

export type UseReactiveObjectsSyncOptions<
  L extends SyncObject,
  R extends SyncObject,
> = {
  left       : MaybeRefOrGetter<L | undefined>,
  right      : MaybeRefOrGetter<R | undefined>,
  getLeft?   : Getter<L>;
  setLeft?   : Setter<L>;
  getRight?  : Getter<R>;
  setRight?  : Setter<R>;
  keySource? : Side | (KeyOf<L> | KeyOf<R>)[];
  onChange?  : (side: Side, key: unknown, value: unknown) => void;
};

export type ComputedReadWriteOptions<S extends SyncObject> = {
  getter?   : Getter<S>;
  setter?   : Setter<S>;
  onChange? : (side: Side, key: unknown, value: unknown) => void;
};


/**
 * Returns an array ref that keeps up-to-date with the enumerable property
 * names of the provided reactive object.
 */
function objectKeysRef<S extends SyncObject>(source: MaybeRefOrGetter<S | undefined>): Ref<KeyOf<S>[]> {
  const keys = shallowRef<KeyOf<S>[]>([]);

  watchEffect(() => {
    const value = toValue(source);
    keys.value = value ? Object.keys(value) : [];
  });

  return keys;
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
): ComputedRef<Set<KeyOf<L> | KeyOf<R>>> {
  const leftKeys = (!options.keySource || options.keySource === 'left')
    ? objectKeysRef(options.left)
    : undefined;

  const rightKeys = (!options.keySource || options.keySource === 'right')
    ? objectKeysRef(options.right)
    : undefined;

  return computed(() => {
    if (Array.isArray(options.keySource)) {
      return new Set(options.keySource);
    }

    return new Set(
      [...(leftKeys?.value ?? []), ...(rightKeys?.value ?? [])],
    );
  });
}


/**
 * Creates a read/writable computed instance for interacting with the property
 * of name `key` on the reactive `source` object. Optional `getter` and
 * `setter` methods can be provided to further augment behavior.
 */
function computedReadWrite<S extends SyncObject>(
  source   : MaybeRefOrGetter<S | undefined>,
  key      : KeyOf<S>,
  side     : 'left' | 'right',
  options? : ComputedReadWriteOptions<S>,
) {
  return computed({
    get() {
      return options?.getter
        ? options?.getter(toValue(source), key)
        : toValue(source)?.[key];
    },

    set(val: any) {
      options?.onChange?.(side, key, val);

      if (options?.setter) {
        options.setter(val, toValue(source), key);
      }
      else {
        const target = toValue(source);

        if (target) {
          target[key] = val;
        }
      }
    },
  });
}


/**
 *
 */
export function useReactiveObjectsSync<
  L extends SyncObject,
  R extends SyncObject,
>(options: UseReactiveObjectsSyncOptions<L, R>) {
  const { left, right } = options;

  const watchKeys  = aggregateKeys(options);
  const syncHandle = new Map<KeyOf<L> | KeyOf<R>, SyncHandle>();

  watch(watchKeys, (newKeys, oldKeys) => {
    // Remove old keys
    for (const key of oldKeys.difference(newKeys)) {
      const handle = syncHandle.get(key);

      if (handle) {
        syncHandle.delete(key);
        handle.stopSync();
      }
    }

    // Add new keys
    for (const key of newKeys) {
      if (syncHandle.has(key)) {
        continue;
      }

      const leftRef  = computedReadWrite(left, key, 'left', {
        getter   : options.getLeft,
        setter   : options.setLeft,
        onChange : options.onChange,
      });

      const rightRef = computedReadWrite(right, key, 'right', {
        getter   : options.getRight,
        setter   : options.setRight,
        onChange : options.onChange,
      });

      const stopSync = syncRef(leftRef, rightRef);

      syncHandle.set(key, { leftRef, rightRef, stopSync });
    }
  });
}
