import type { HintedString, StyleStatusLevel } from './types';

/**
 * Icon classnames that pair with the various status levels supported through
 * the application.
 */
export const StatusLevelIcons: Record<HintedString<StyleStatusLevel>, string> = {
  info     : 'i-ph-head-circuit',
  help     : 'i-ph-head-circuit',
  success  : 'i-ph-confetti',
  warn     : 'i-ph-warning',
  error    : 'i-ph-warning-octagon',
  default  : 'i-ph-info',
  inverted : 'i-ph-info',
};


export const TeleportId             = '#resee-ux-teleport';
export const OverflowHiddenClass    = 'p-overflow-hidden';
export const ScrollbarWidthPropName = '--p-scrollbar-width';


export const DefaultLocalization = {
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

  continueReading: 'Continue Reading',
};
