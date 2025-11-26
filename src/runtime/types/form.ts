import type { FormSubmitEvent as PrimeFormSubmitEvent } from '@primevue/forms/form';
import type { Ref } from 'vue';


/**
 * An object which carries the current values of a form's input fields.
 */
export type FormValues = Record<string, any>;


/**
 * The object provided by a form, conveying stateful information, that can be
 * injected into descendent components.
 */
export interface FormInstance {
  hasSubmitted : Ref<boolean>;
  isSubmitting : Ref<boolean>;
  isDisabled   : Ref<boolean>;
  // isValid      : Ref<boolean>;
}


/**
 * The event argument of a Form's `onsubmit` callback.
 */
export type FormSubmitEvent<T extends FormValues = FormValues> = PrimeFormSubmitEvent<T>;


/**
 * The `onsubmit` callback method of a Form.
 */
export type FormSubmitHandler<T extends FormValues = FormValues>
  = (event: FormSubmitEvent<T>) => void | Promise<void>;
