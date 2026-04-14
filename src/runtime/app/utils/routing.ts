import { useNuxtApp } from '#app';
import { isChangingPage } from '#app/components/utils';
import { appPageTransition as defaultPageTransition } from '#build/nuxt.config.mjs';
import type { RouteLocationGeneric, RouteLocationNormalizedGeneric, RouterScrollBehavior } from 'vue-router';


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


type ScrollPosition = Awaited<ReturnType<RouterScrollBehavior>>;

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
  let position: ScrollPosition = savedPosition || undefined;

  const routeAllowsScrollToTop = typeof to.meta.scrollToTop === 'function'
    ? to.meta.scrollToTop(to, from)
    : to.meta.scrollToTop;

  if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
    position = { left: 0, top: 0 };
  }


  const getScrollToElementInfo = (id: string) => {
    const targetElement = document.querySelector(id);

    // Take the scroll margin into account.
    if (targetElement) {
      const topOffset = Number.parseFloat(getComputedStyle(targetElement).scrollMarginBlockStart || '0');

      return {
        el       : targetElement,
        top      : topOffset,
        behavior : 'smooth' as const,
      };
    }
  };

  // If a hash is present, and it differs from the previous hash value,
  // then we will scroll to it. Checking that the hash has changed here
  // is important. If the user were to follow a hash link, scroll away,
  // and then do something else that changed the URL - say, altered a
  // query value - then without this extra check the page would jump
  // back to the hash.
  if (to.path === from.path && to.hash && to.hash !== from.hash) {
    const scrollInfo = getScrollToElementInfo(to.hash);

    if (scrollInfo) {
      return scrollInfo;
    }
  }

  // Short circuit here if the paths are the same. The only thing left to
  // be changing is query params, and as of writing there is no usage
  // scenario that requires scrolling when they are altered.
  if (to.path === from.path) {
    return false;
  }


  const hasTransition = (route: RouteLocationNormalizedGeneric) => {
    return !!(route.meta.pageTransition ?? defaultPageTransition);
  };

  const nuxtApp = useNuxtApp();
  const waitFor = (hasTransition(from) && hasTransition(to)) ? 'page:transition:finish' : 'page:loading:end';

  return new Promise<ScrollPosition>((resolve) => {
    nuxtApp.hooks.hookOnce(waitFor, () => {
      requestAnimationFrame(() => {
        if (position) {
          return resolve(position);
        }

        if (to.hash) {
          const scrollInfo = getScrollToElementInfo(to.hash);

          if (scrollInfo) {
            return resolve(scrollInfo);
          }
        }

        resolve({ left: 0, top: 0 });
      });
    });
  });
};
