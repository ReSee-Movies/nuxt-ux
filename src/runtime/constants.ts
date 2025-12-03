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


export const TeleportId = '#resee-ux-teleport';
