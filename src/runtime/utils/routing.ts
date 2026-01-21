import type { RouteLocationGeneric, RouterScrollBehavior } from 'vue-router';


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


/**
 * An implementation of Vue Router's RouterScrollBehavior interface, custom tailored
 * for ReSee.
 *
 * ```ts
 * // app/router.options.ts
 *
 * import { reseeScrollBehavior } from '#resee-ux/utils/routing';
 * import type { RouterConfig } from '@nuxt/schema';
 *
 * export default {
 *   scrollBehavior: reseeScrollBehavior,
 * } satisfies RouterConfig;
 * ```
 */
export const reseeScrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  // Return a saved position as-is.
  if (savedPosition) {
    return savedPosition;
  }

  // If a hash is present, and it differs from the previous hash value,
  // then we will scroll to it. Checking that the hash has changed here
  // is important. If the user were to follow a hash link, scroll away,
  // and then do something else that changed the URL - say, altered a
  // query value - then without this extra check the page would jump
  // back to where the hash is.
  if (to.hash && to.hash !== from.hash) {
    const targetElement = document.querySelector(to.hash);

    // Take the scroll margin into account.
    if (targetElement) {
      const topOffset = parseFloat(getComputedStyle(targetElement).scrollMarginBlockStart || '0');

      return {
        el       : targetElement,
        top      : topOffset,
        behavior : 'smooth',
      };
    }
  }

  // Short circuit here if the paths are the same. The only thing left to
  // be changing is query params, and as of writing there is no usage
  // scenario that requires scrolling when they are altered.
  if (to.path === from.path) {
    return false;
  }

  // Lastly, scroll to the top.
  return { left: 0, top: 0 };
}
