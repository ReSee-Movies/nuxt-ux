import { useDevice } from '#imports';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';


/**
 * Preconfigures the Vueuse {@link useBreakpoints} composable for use
 * with ReSee projects. If available, the user-agent is used in SSR to
 * try and determine the correct break to report.
 */
export function useReseeBreakpoints() {
  let ssrWidth: number | undefined = undefined;

  if (import.meta.server) {
    const device = useDevice();

    if (device.isTablet) {
      ssrWidth = breakpointsTailwind.md;
    }
    else if (device.isMobile) {
      ssrWidth = breakpointsTailwind.sm;
    }
    else {
      ssrWidth = breakpointsTailwind.lg;
    }
  }

  return useBreakpoints(breakpointsTailwind, { ssrWidth });
}
