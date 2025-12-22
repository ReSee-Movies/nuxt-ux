import { useCookie } from '#imports';
import { reactive } from 'vue';


const Localization = reactive({
  validation: {
    required       : 'Required',
    invalidEmail   : 'A valid email address is required',
    invalidUrl     : 'A valid URL (https://...) is required',
    tooFewChars    : 'Must have at least {count} character(s)',
    tooManyChars   : 'Cannot have more than {count} character(s)',
    tooFewOptions  : 'Must select at least {count} option(s)',
    tooManyOptions : 'Cannot select more than {count} option(s)',
  },

  form: {
    submitButtonLabel  : 'Submit',
    filterPlaceholder  : 'Search',
    filterNoResults    : 'No Results Found',
    noOptionsAvailable : 'No Options Available',
    selectAllOptions   : 'Select All',
    numOptionsSelected : '{count} Item(s) Selected',
  },
});

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
