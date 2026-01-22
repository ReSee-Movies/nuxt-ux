import { useCookie } from '#imports';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { DefaultLocalization } from '../constants';

export type ReseeUxAppPreferences = {
  dismissNotification?: string;
};

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

  return {
    locale,
    preferences,
  };
});
