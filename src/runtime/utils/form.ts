import { equals, resolveFieldData } from '@primeuix/utils/object';
import type { FormFieldState } from '@primevue/forms';
import { isNumber } from '@resee-movies/utilities/numbers/is-number';
import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { computed, inject, type InjectionKey, type MaybeRefOrGetter, provide, ref, toRaw, toValue } from 'vue';
import type { FormInstance, FormValues } from '../types/form';


/**
 * The injection key for acquiring a {@link FormInstance} object within the
 * descendant component of a Form. Consider using {@link injectFormInstance}
 * instead.
 */
export const FormSymbol = Symbol('form') as InjectionKey<FormInstance>;


/**
 * Helper method to create a new stateful object for a Form. You shouldn't ever
 * need to use this directly.
 *
 * @private
 */
export function createFormInstance(uid?: string): FormInstance {
  return {
    formUid      : uid,
    hasSubmitted : ref(false),
    isSubmitting : ref(false),
    isDisabled   : ref(false),
  };
}


/**
 * Provides the object that a Form uses to convey stateful information to the
 * DI registry. You shouldn't ever need to use this directly.
 *
 * @private
 */
export function provideFormInstance(uid?: string): FormInstance {
  const instance = createFormInstance(uid);
  provide(FormSymbol, instance);
  return instance;
}


/**
 * Injects the stateful object provided by an ancestor Form instance. If not
 * available, a dummy state object is generated.
 *
 * @private
 */
export function injectFormInstance(uid?: string): FormInstance {
  return inject(FormSymbol, () => createFormInstance(uid), true);
}


/**
 * Takes a Primevue Form's `states` object, and extracts the current values
 * of each named property. In doing so, it will deref proxies, and create
 * shallow clones of any arrays/objects it encounters.
 *
 * @private
 */
export function getValuesFromFormState<T extends FormValues = FormValues>(state: Record<string, FormFieldState>): T {
  const result = {} as T;

  for (const [key, value] of Object.entries(state)) {
    const rawValue = toRaw(toValue(value.value));

    let processed;

    if (Array.isArray(rawValue)) {
      processed = Array.from(rawValue);
    }
    else if (isObjectLike(rawValue)) {
      processed = { ...rawValue };
    }
    else {
      processed = rawValue;
    }

    Object.defineProperty(result, key, { value: processed, enumerable: true });
  }

  return result;
}


/**
 * @private
 */
export type UseOptionListMethodsConfig = {
  optionLabel?    : string | ((data: unknown) => string);
  optionValue?    : string | ((data: unknown) => string);
  optionIcon?     : string | ((data: unknown) => string);
  optionDisabled? : string | ((data: unknown) => boolean);
  optionDataKey?  : string;
};


/**
 * Creates a set of common methods for interacting with an array of "options" like what
 * gets provided to a Select or RadioGroup.
 *
 * @private
 */
export function useOptionListMethods(config: MaybeRefOrGetter<UseOptionListMethodsConfig>) {
  return computed(() => {
    const {
      optionLabel,
      optionValue,
      optionIcon,
      optionDisabled,
      optionDataKey,
    } = toValue(config);

    /**
     * Returns the configured label of the option. This will either be the value of
     * the `optionLabel` property of the option, or the option itself, cast to a
     * string.
     */
    const getOptionLabel = (option: unknown): string => {
      return String(optionLabel ? resolveFieldData(option, optionLabel) : option);
    };

    /**
     * Returns the configured value of the option. This will either be the value of
     * the `optionValue` property of the option, or the option itself.
     */
    const getOptionValue = (option: unknown): unknown => {
      return optionValue ? resolveFieldData(option, optionValue) : option;
    };

    /**
     * Returns the configured icon of the option. This will either be the value of
     * the `optionIcon` property of the option, or undefined.
     */
    const getOptionIcon = (option: unknown): string | undefined => {
      return optionIcon ? String(resolveFieldData(option, optionIcon)) : undefined;
    };

    /**
     * Returns whether the option is disabled. This will either be the value of
     * the `optionDisabled` property of the option, cast to a boolean, or false.
     */
    const getOptionDisabled = (option: unknown): boolean => {
      return Boolean(optionDisabled ? resolveFieldData(option, optionDisabled) : false);
    };

    /**
     * Attempts to return a suitable value for the provided option argument that can
     * be used as that option's `key` in the template's for loop.
     */
    const getOptionRenderKey = (option: unknown): string | number | undefined => {
      const result = optionDataKey ? resolveFieldData(option, optionDataKey) : getOptionLabel(option);
      return isString(result) || isNumber(result) ? result : undefined;
    };

    /**
     * Finds the index of the provided option in the selected options array. This
     * will always return a number, even if no options have been selected (-1), or
     * the control is in single selection mode and so `haystack` is not an array (0
     * if matched, -1 if not).
     */
    const getOptionIndex = (needle: unknown, haystack: unknown): number => {
      const rawHaystack = toValue(haystack);
      const optionValue = getOptionValue(needle);
      const equalityKey = optionValue ? undefined : optionDataKey;

      if (Array.isArray(rawHaystack)) {
        return rawHaystack.findIndex((entry) => equals(entry, optionValue, equalityKey));
      }

      return equals(rawHaystack, optionValue, equalityKey) ? 0 : -1;
    };

    /**
     * Finds an option via its value and the source array.
     */
    const getOptionByValue = <T>(needle: unknown, haystack: MaybeRefOrGetter<T[] | undefined>): T | undefined => {
      const equalityKey = optionValue ? undefined : optionDataKey;

      return toValue(haystack)?.find(
        (option) => equals(getOptionValue(option), needle, equalityKey),
      );
    };

    return {
      getOptionLabel,
      getOptionValue,
      getOptionIcon,
      getOptionDisabled,
      getOptionRenderKey,
      getOptionIndex,
      getOptionByValue,
    };
  });
}
