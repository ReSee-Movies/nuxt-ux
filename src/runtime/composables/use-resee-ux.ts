import { useCookie } from '#imports';
import { reactive } from 'vue';
import { DefaultLocalization } from '../constants';


const Localization = reactive(DefaultLocalization);

type AppPreferences = {
  dismissNotification?: string;
};

const msInYear = 31_536e6;


/**
 * Provides the ability to manage runtime configuration of the ReSee UX
 * module.
 */
export function useReseeUx() {
  const preferences = useCookie<AppPreferences>('resee-app-preferences', {
    default  : () => ({}),
    secure   : true,
    httpOnly : false,
    sameSite : 'strict',
    maxAge   : msInYear / 1000,
    expires  : new Date(Date.now() + msInYear),
  });

  return { locale: Localization, preferences };
}
