import { useCookie, useRuntimeConfig } from '#imports';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { DefaultLocalization } from '../constants';
import type { ReseeUxPublicRuntimeConfig } from '../types';


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

  return {
    locale,
    preferences,
    config,
  };
});
