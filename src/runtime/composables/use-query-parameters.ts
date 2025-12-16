import { useRoute, useRouter } from '#imports';
import { areEqual } from '@resee-movies/utilities/objects/are-equal';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { slugify } from '@resee-movies/utilities/strings/slugify';
import { customRef, type MaybeRefOrGetter, nextTick, onScopeDispose, reactive, toValue, watch } from 'vue';
import type { LocationQueryValueRaw, Router } from 'vue-router';


/**
 * Two-way bind to URL query parameters.
 */
export function useQueryParameters<
  D extends QueryParamDefinitionMap,
>(
  params   : D,
  options? : UseQueryParametersOptions,
): UseQueryParametersReturn<D> {
  const router = useRouter();
  const queue  = getQueueForRouter(router, options?.mode);

  const refs = {} as Record<string, unknown>;

  for (const [name, definition] of Object.entries(params)) {
    refs[name] = getQueryRef({
      slug         : slugify(name, { decamelize: true }),
      type         : definition.type,
      setCallback  : queue.add,
      defaultValue : definition.defaultValue,
    });
  }

  return reactive(refs) as UseQueryParametersReturn<D>;
}


/**
 * Configuration for the {@link useQueryParameters} composable.
 */
export type UseQueryParametersOptions = {
  /* How parameters will be added to the route. "replace" results in no history being created. */
  mode?: 'replace' | 'push';
};


/**
 * Configuration for a single URL query parameter.
 */
export type QueryParamDefinition = {
  /**
   * The data type of the query parameter's value. Since this object needs
   * to be defined at runtime, primitive constructors are used to indicate
   * the data type.
   */
  type: StringConstructor | [StringConstructor] | BooleanConstructor;

  /**
   * A value that will be used if no query parameter is set.
   */
  defaultValue?: unknown;
};


/**
 * An object wherein the keys are URL query parameter names, and the values at
 * each key determine the (de)serialization of that parameter (and other behaviors).
 */
export type QueryParamDefinitionMap = {
  [K: string]: QueryParamDefinition;
};


/**
 * A mapping from runtime-available primitive constructors, to TS typings which
 * correspond to the different data types of URL query parameters that this
 * composable supports.
 */
export type QueryParamValueType<T extends QueryParamDefinition['type']> =
  T extends StringConstructor
    ? string | undefined
    : T extends [StringConstructor]
      ? string[] | undefined
      : T extends BooleanConstructor
        ? boolean | undefined
        : never;


/**
 * The return type of the {@link useQueryParameters} composable.
 */
export type UseQueryParametersReturn<M extends QueryParamDefinitionMap> = {
  [K in keyof M]: QueryParamValueType<M[K]['type']>;
};


// ---------------------------
// Module Internals
// ---------------------------

type Nullish<T> = T | null | undefined;

type SetCallback = (slug: string, value: unknown, cache?: boolean) => void;

type TransformFn<In, Out> = (value: In) => Out;

type MakeTrackingRefConfig<AppType, QueryType> = {
  slug          : string;
  getTransform  : TransformFn<QueryType, AppType>;
  setTransform  : TransformFn<AppType, QueryType>;
  setCallback   : SetCallback;
  defaultValue? : MaybeRefOrGetter<AppType>;
};

type GetQueryRefConfig = {
  slug          : string;
  type          : StringConstructor | [StringConstructor] | BooleanConstructor;
  setCallback   : SetCallback;
  defaultValue? : unknown;
};


const _queue = new WeakMap<Router, Map<string, unknown>>();

/**
 * Returns an object with an `add` method that is intended to be passed to each
 * tracking ref (which will call it when a value change occurs that requires a
 * URL update).
 *
 * Internally, updates are batched together after `nextTick`.
 */
function getQueueForRouter(router: Router, mode: 'push' | 'replace' = 'push') {
  if (!_queue.has(router)) {
    _queue.set(router, new Map());
  }

  const routerQueue = _queue.get(router)!;

  const add = async (slug: string, value: unknown) => {
    routerQueue.set(slug, value);

    await nextTick();

    if (routerQueue.size === 0) {
      return;
    }

    const newValues = Object.fromEntries(routerQueue.entries()) as Record<string, LocationQueryValueRaw>;
    routerQueue.clear();

    const { params, query, hash } = router.currentRoute.value;

    await router[mode]({
      params,
      query: { ...query, ...newValues },
      hash,
    });
  };

  return { add };
}


/**
 * Creates a new two-way ref for reading/writing a URL query value, based
 * on the provided type.
 */
function getQueryRef(config: GetQueryRefConfig) {
  const { slug, type, setCallback, defaultValue } = config;

  // String arrays
  if (Array.isArray(type) && type[0] === String) {
    const defaultVal = Array.isArray(defaultValue) && defaultValue.length > 0
      ? defaultValue
      : undefined;

    return makeTrackingRef({
      slug         : slug,
      defaultValue : defaultVal,
      setCallback  : setCallback,
      getTransform : toStringArrayOrUndefined,
      setTransform : toStringArrayOrUndefined,
    });
  }

  // Strings
  if (type === String) {
    const defaultVal = isString(defaultValue)
      ? defaultValue
      : undefined;

    return makeTrackingRef({
      slug         : slug,
      defaultValue : defaultVal,
      setCallback  : setCallback,
      getTransform : toStringOrUndefined,
      setTransform : toStringOrUndefined,
    });
  }

  // Booleans
  if (type === Boolean) {
    const defaultVal = typeof defaultValue === 'boolean'
      ? true
      : undefined;

    return makeTrackingRef({
      slug         : slug,
      defaultValue : defaultVal,
      setCallback  : setCallback,
      getTransform : toBooleanOrUndefined,
      setTransform : (value) => value ? null : undefined,
    });
  }

  return undefined;
}


/**
 * Given a `value` that can be a string, null, or undefined, ensure that the return
 * is either a string of length >= 1 which contains something other than whitespace,
 * or undefined.
 */
function toStringOrUndefined(value: Nullish<string>) {
  return isString(value, { withContent: true }) ? value : undefined;
}


/**
 * Given a `value` that can be a string, string array, or undefined, ensure that the return
 * is either a string array of length >= 1, or undefined.
 */
function toStringArrayOrUndefined(value: Nullish<string | string[]>) {
  if (Array.isArray(value)) {
    return value.length ? value : undefined;
  }

  return isString(value) ? [value] : undefined;
}


/**
 * Given a `value` that can be a string, null, or undefined, ensure that the return
 * is either a boolean true or undefined. In the land of Vue, valueless query parameters
 * (e.g. "?foo", instead of "?foo=bar") have a value of null, which for our purposes
 * will be interpreted as a boolean true (its existence in the query acts like a
 * simple on/off switch).
 */
function toBooleanOrUndefined(value: Nullish<string>) {
  if (isString(value)) {
    return (value.toLowerCase() === 'true' || value === '') ? true : undefined;
  }

  return value === null ? true : undefined;
}


/**
 * Returns a writable computed object that is bound to the state of a single query
 * parameter on the current route. This is most of what Vueuse does in its own
 * `useQueryParam` composable, so kudos to them.
 */
function makeTrackingRef<AppType = unknown, QueryType = AppType>(
  config: MakeTrackingRefConfig<Nullish<AppType>, Nullish<QueryType>>,
) {
  const route = useRoute();

  let queryVal   = route.query[config.slug] as Nullish<QueryType>;
  let refTrigger = () => {};

  onScopeDispose(() => {
    queryVal = undefined;
  }, true);

  const ref = customRef((track, trigger) => {
    refTrigger = trigger;

    return {
      get() {
        track();

        const transformed = config.getTransform(queryVal);

        return transformed === undefined
          ? toValue(config.defaultValue)
          : transformed;
      },

      set(val: Nullish<AppType>) {
        const transformed = config.setTransform(val);

        if (areEqual(transformed, queryVal)) {
          return;
        }

        const defaultVal = toValue(config.defaultValue);

        queryVal = transformed === defaultVal
          ? undefined
          : transformed;

        config.setCallback(config.slug, queryVal);
        trigger();
      },
    };
  });

  watch(
    () => route.query[config.slug] as Nullish<QueryType>,
    (newValue) => {
      if (areEqual(config.getTransform(newValue), queryVal)) {
        return;
      }

      queryVal = newValue;
      refTrigger();
    },
    { flush: 'sync' },
  );

  return ref;
}
