import type { RouteLocationGeneric } from 'vue-router';


/**
 * Strictly compare the entirety of two URLs, including their hashes.
 *
 * This is required for two reasons:
 *
 * 1) NuxtLink does not provide equivalent results when parsing `:to` and `:href`
 * props (the value of a URL's `hash` will appear in the `fullPath` of the former,
 * but not the latter).
 * 2) NuxtLink does not take into account the value of `hash` when computing whether
 * a link is active. This makes sense for a lot of circumstances, but in some cases
 * is required.
 */
export function areRoutesStrictEqual(
  routeA: RouteLocationGeneric | undefined,
  routeB: RouteLocationGeneric | undefined,
) {
  if (!(routeA && routeB)) {
    return false;
  }

  let fullPathA = routeA.fullPath;
  let fullPathB = routeB.fullPath;

  if (routeA.hash && !fullPathA.endsWith(routeA.hash)) {
    fullPathA += routeA.hash;
  }

  if (routeB.hash && !fullPathB.endsWith(routeB.hash)) {
    fullPathB += routeB.hash;
  }

  return fullPathA === fullPathB;
}



