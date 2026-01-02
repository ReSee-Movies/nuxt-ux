import type { breakpointsTailwind } from '@vueuse/core';
import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';
import { useReseeBreakpoints } from './use-resee-breakpoints';


export type BreakpointSettingName = (keyof typeof breakpointsTailwind) | 'default';

export type BreakpointSettings<T> = Partial<Record<BreakpointSettingName, T>>;


/**
 * Given an object whose properties are Tailwind breakpoint names, this will return
 * the value of the property that matches the active breakpoint. If an exact match
 * is not available, a mobile-first approach is taken - the first value of a smaller
 * breakpoint, or finally the `default`, will be returned.
 */
export function useSettingsForBreakpoint<T>(
  settings: MaybeRefOrGetter<BreakpointSettings<T> | null | undefined>,
): ComputedRef<T | undefined> {
  const ordering    = ['default', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
  const activeBreak = useReseeBreakpoints().active();

  return computed(() => {
    const breakpoint  = activeBreak.value || 'default';
    const rawSettings = toValue(settings);

    // No settings, nothing to return.
    if (!rawSettings) {
      return undefined;
    }

    // Does the current breakpoint have settings?
    // If so, return them.
    if (breakpoint in rawSettings) {
      return rawSettings[breakpoint];
    }

    // If not, walk backwards to the first available settings
    // or ultimately return the default, if available.
    let idx = ordering.indexOf(breakpoint);

    while (idx > 0) {
      idx -= 1;

      const name = ordering[idx];

      if (name && name in rawSettings) {
        return rawSettings[name];
      }
    }

    return rawSettings['default'];
  });
}
