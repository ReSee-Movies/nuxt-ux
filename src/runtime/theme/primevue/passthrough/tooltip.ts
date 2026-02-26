import type { TooltipDirectivePassThroughOptions } from 'primevue';

const TooltipPassThru: TooltipDirectivePassThroughOptions = {
  root({ context }) {
    return {
      class: ['tooltip', {
        left   : context.left,
        right  : context.right || !(context.left || context.top || context.bottom),
        top    : context.top,
        bottom : context.bottom,
      }],
    };
  },

  text  : { class: 'content' },
  arrow : { class: 'arrow' },
};

export default TooltipPassThru;
