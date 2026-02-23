import { useCookie } from '#imports';
import { type ReseeUtilitiesRuntimeConstants, setReseeUtilityConstant } from '@resee-movies/utilities/config';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { DefaultLocalization } from '../constants';

export type ReseeUxAppPreferences = {
  dismissNotification?: string | string[];
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

  function setReseeUxConstant(value: Partial<ReseeUtilitiesRuntimeConstants>) {
    setReseeUtilityConstant(value);
  }

  return {
    locale,
    preferences,
    setReseeUxConstant,
  };
});
