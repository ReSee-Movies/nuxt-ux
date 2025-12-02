import { reactive } from 'vue';


const Localization = reactive({
  validation: {
    required     : 'Required',
    invalidEmail : 'A valid email address is required',
    invalidUrl   : 'A valid URL (https://...) is required',
    tooFewChars  : 'Must have at least {count} character(s)',
    tooManyChars : 'Cannot have more than {count} character(s)',
  },

  form: {
    filterPlaceholder  : 'Search',
    filterNoResults    : 'No Results Found',
    noOptionsAvailable : 'No Options Available',
  },
});


/**
 * Provides the ability to manage runtime configuration of the ReSee UX
 * module.
 */
export function useReseeUx() {
  return { locale: Localization };
}
