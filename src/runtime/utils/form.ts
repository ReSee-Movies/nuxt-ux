import type { FormFieldState } from '@primevue/forms';
import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
import { inject, type InjectionKey, provide, ref, toRaw, toValue } from 'vue';
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
export function createFormInstance(): FormInstance {
  return {
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
export function provideFormInstance(): FormInstance {
  const instance = createFormInstance();
  provide(FormSymbol, instance);
  return instance;
}


/**
 * Injects the stateful object provided by an ancestor Form instance. If not
 * available, a dummy state object is generated.
 */
export function injectFormInstance(): FormInstance {
  return inject(FormSymbol, () => createFormInstance(), true);
}


/**
 * Takes a Primevue Form's `states` object, and extracts the current values
 * of each named property. In doing so, it will deref proxies, and create
 * shallow clones of any arrays/objects it encounters.
 */
export function getValuesFromFormState<T extends FormValues = FormValues>(state: Record<string, FormFieldState>): T {
  const result = {} as T;

  for (const [key, value] of Object.entries(state)) {
    const rawValue = toRaw(toValue(value));

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

    Object.defineProperty(result, key, { value: processed });
  }

  return result;
}
