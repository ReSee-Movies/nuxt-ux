import { toInteger } from '@resee-movies/utilities/numbers/to-integer';
import z, { type core } from 'zod/mini';
import { useReseeUx } from '../composables/use-resee-ux';


/**
 * Replaces any substrings within `str` of the form "{placeholder_key}" with
 * the value provided via the `placeholders` object.
 *
 * @private
 */
export function toValidationError(str: string, placeholders?: Record<string, string | number>) {
  return {
    error: placeholders
      ? str.replace(/\{\s*(\w+?)\s*}/g, (_, token) => String(placeholders[token] || ''))
      : str,
  };
}


/**
 *
 */
export type BooleanInputRequirements = {
  required?: boolean;
}


/**
 *
 */
export function createBooleanValidator(requirements: BooleanInputRequirements) {
  const { locale } = useReseeUx();

  return requirements.required
    ? z.coerce.boolean().check(z.refine(val => val === true, toValidationError(locale.validation.required)))
    : undefined;
}


/**
 *
 */
export type TextInputRequirements = {
  required?  : boolean;
  type?      : 'text' | 'email' | 'url';
  minLength? : string | number;
  maxLength? : string | number;
}


/**
 *
 */
export function createTextValidator(requirements: TextInputRequirements) {
  const { locale } = useReseeUx();
  const checkFns   = [] as core.$ZodCheck<unknown>[];

  if (requirements.required) {
    checkFns.push(z.minLength(1, toValidationError(locale.validation.required)));
  }

  if (requirements.type === 'email') {
    checkFns.push(z.email(toValidationError(locale.validation.invalidEmail )));
  }
  else if (requirements.type === 'url') {
    checkFns.push(z.url(toValidationError(locale.validation.invalidUrl )));
  }
  else {
    const minLength = toInteger(requirements.minLength);
    const maxLength = toInteger(requirements.maxLength);

    if (minLength) {
      checkFns.push(
        z.minLength(minLength, toValidationError(locale.validation.tooFewChars, { count: minLength })),
      );
    }

    if (maxLength) {
      checkFns.push(
        z.maxLength(maxLength, toValidationError(locale.validation.tooManyChars, { count: maxLength })),
      );
    }
  }

  const stringSchema = z.string(
    toValidationError(locale.validation.required),
  ).check(z.trim(), ...checkFns);

  return requirements.required
    ? stringSchema
    : z.union([z.null({ error: locale.validation.required }), stringSchema]);
}
