import { useCookie, useRuntimeConfig } from '#imports';
import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { DefaultLocalization } from '../constants';
import type { ReseeUxPublicRuntimeConfig } from '../../../utils/types';
import type { ExtractKeyValue, ExtractLeafKeys } from '../types';
import { swapStringPlaceholders } from '../utils/string';


export type ReseeUxAppPreferences = {
  dismissNotification?: string | string[];
} & Record<string, unknown>;


/**
 * Various runtime configuration bits and bobs for the ReSee UX module.
 */
export const useReseeUxStore = defineStore('resee-ux', () => {
  const locale = reactive(DefaultLocalization);

  const msInYear = 31_536e6;

  const preferences = useCookie<ReseeUxAppPreferences>('resee-app-preferences', {
    default  : () => ({}),
    secure   : true,
    httpOnly : false,
    sameSite : 'strict',
    maxAge   : msInYear / 1000,
    expires  : new Date(Date.now() + msInYear),
  });

  const config = reactive<ReseeUxPublicRuntimeConfig>({
    ...(useRuntimeConfig().public.ux ?? {}),
  });


  /**
   * Returns a locale string via its `dot.separated.key`. If the result has placeholders,
   * an object can be provided to swap (see {@link swapStringPlaceholders}).
   */
  const getLocaleString = <
    K extends ExtractLeafKeys<typeof DefaultLocalization>,
  >(
    keyChain      : K,
    placeholders? : Record<string, unknown>,
  ) => {
    let currentNode: unknown = DefaultLocalization;

    for (const link of keyChain.split('.')) {
      if (!isObjectLike(currentNode)) {
        currentNode = undefined;
        break;
      }

      currentNode = currentNode[link];
    }

    if (isString(currentNode)) {
      currentNode = swapStringPlaceholders(currentNode, placeholders);
    }

    return currentNode as ExtractKeyValue<typeof DefaultLocalization, K>;
  };

  return {
    locale,
    preferences,
    config,
    getLocaleString,
  };
});
