import { useRouter } from '#imports';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { computed, type Ref } from 'vue';
import type { RouteLocationResolvedGeneric } from 'vue-router';


/**
 * Vue Router's `resolve` method creates a RouteLocationResolvedGeneric object,
 * while Vue Router's `currentRoute` ref expects a RouteLocationNormalizedLoadedGeneric
 * object (because of course). There is an inconsistency between the two in that the
 * former's `name` property can be null, while the latter's cannot. This means you
 * cannot directly assign the former to the latter without TS complaining.
 *
 * The exceptionally long name here is a nod to the 50+ other _Location_ types that
 * Vue Route exposes.
 */
export type RouteLocationResolvedGenericWithNonNullableName
  = Omit<RouteLocationResolvedGeneric, 'name'> & { name: string | undefined };


/**
 * Options for the `update` method returned by the {@link useUrlHash} composable.
 */
export type UseUrlHashUpdateOptions = {
  /**
   * Whether to update the hash in a way that will cause the browser
   * to scroll to the identified element (default: false).
   */
  scrollTo? : boolean;

  /**
   * Whether to create a new history entry for the hash - push - or to replace the
   * current (default: replace).
   */
  mode?: 'push' | 'replace';
}


/**
 * The return type of the {@link useUrlHash} composable.
 */
export type UseUrlHashReturn = {
  value  : Readonly<Ref<string | undefined>>;
  update : (newHash: string | undefined, options?: UseUrlHashUpdateOptions) => boolean;
};


/**
 * Read/Write the current URL hash value. By default, this will be done in a way that does
 * not cause browser scroll to behavior to occur - very useful when updating the hash
 * based on the scroll position of the page.
 */
export function useUrlHash(): UseUrlHashReturn {
  const router = useRouter();

  const value = computed(() => {
    return router.currentRoute.value.hash || undefined;
  });

  const update = (newHash: string | undefined, options?: UseUrlHashUpdateOptions) => {
    const normalizedHash = isString(newHash, { withContent: true })
      ? (!newHash.startsWith('#') ? `#${ newHash }` : newHash)
      : undefined;

    const { path, query, hash } = router.currentRoute.value;

    if (normalizedHash && hash && normalizedHash === hash) {
      return false;
    }

    if (options?.scrollTo === true) {
      (options?.mode === 'push' ? router.push : router.replace)({ path, query, hash: normalizedHash });
      return true;
    }

    const newRoute = router.resolve({ path, query, hash: normalizedHash });
    router.currentRoute.value = newRoute as RouteLocationResolvedGenericWithNonNullableName;

    window.history[options?.mode === 'push' ? 'pushState' : 'replaceState'](null, '', normalizedHash);

    return true;
  };

  return { value, update };
}
