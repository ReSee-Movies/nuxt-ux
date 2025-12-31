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
  formUid      : string | undefined;
  hasSubmitted : Ref<boolean>;
  isSubmitting : Ref<boolean>;
  isDisabled   : Ref<boolean>;
}


/**
 * The event argument of a Form's `onSubmit` callback.
 */
export type FormSubmitEvent<T extends FormValues = FormValues> = PrimeFormSubmitEvent<T>;


/**
 * The `onSubmit` callback method of a Form.
 */
export type FormSubmitHandler<T extends FormValues = FormValues>
  = (event: FormSubmitEvent<T>) => void | Promise<void>;


/**
 * The event argument of a Form's `onChange` callback.
 */
export type FormChangeEvent<T extends FormValues = FormValues> = {
  values : T | null;
  valid  : boolean;
};


/**
 * The `onChange` callback method of a Form.
 */
export type FormChangeHandler<T extends FormValues = FormValues>
  = (event: FormChangeEvent<T>) => void | Promise<void>;
