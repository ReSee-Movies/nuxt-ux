import { toInteger } from '@resee-movies/utilities/numbers/to-integer';
import * as z from 'zod/mini';
import type { core } from 'zod/mini';
import { useReseeUxStore } from '../stores/use-resee-ux-store';
import { swapStringPlaceholders } from './string';


export function toValidationError(str: string, placeholders?: Record<string, string | number>) {
  return { error: swapStringPlaceholders(str, placeholders) };
}


export type BooleanInputRequirements = {
  required?: boolean;
}


export function createBooleanValidator(requirements: BooleanInputRequirements) {
  const reseeUx = useReseeUxStore();

  return requirements.required
    ? z.coerce.boolean().check(z.refine(val => val === true, toValidationError(reseeUx.locale.validation.required)))
    : undefined;
}


export type TextInputRequirements = {
  required?  : boolean;
  type?      : 'text' | 'email' | 'url';
  minLength? : string | number;
  maxLength? : string | number;
}


export function createTextValidator(requirements: TextInputRequirements) {
  const reseeUx  = useReseeUxStore();
  const checkFns = [] as core.$ZodCheck<unknown>[];

  if (requirements.required) {
    checkFns.push(z.minLength(1, toValidationError(reseeUx.locale.validation.required)));
  }

  if (requirements.type === 'email') {
    checkFns.push(z.email(toValidationError(reseeUx.locale.validation.invalidEmail )));
  }
  else if (requirements.type === 'url') {
    checkFns.push(z.url(toValidationError(reseeUx.locale.validation.invalidUrl )));
  }
  else {
    const minLength = toInteger(requirements.minLength);
    const maxLength = toInteger(requirements.maxLength);

    if (minLength) {
      checkFns.push(
        z.minLength(minLength, toValidationError(reseeUx.locale.validation.tooFewChars, { count: minLength })),
      );
    }

    if (maxLength) {
      checkFns.push(
        z.maxLength(maxLength, toValidationError(reseeUx.locale.validation.tooManyChars, { count: maxLength })),
      );
    }
  }

  const stringSchema = z
    .string(toValidationError(reseeUx.locale.validation.required))
    .check(z.trim(), ...checkFns);

  return requirements.required
    ? stringSchema
    : z.union([z.undefined(), z.null(), stringSchema]);
}


export type ListInputRequirements = {
  required?    : boolean;
  minRequired? : string | number;
  maxRequired? : string | number;
}


export function createListValidator(requirements: ListInputRequirements) {
  const reseeUx  = useReseeUxStore();
  const checkFns = [] as core.$ZodCheck<unknown>[];

  const minRequired = toInteger(requirements.minRequired) || (requirements.required ? 1 : undefined);
  const maxRequired = toInteger(requirements.maxRequired);

  if (minRequired) {
    checkFns.push(
      z.minLength(minRequired, toValidationError(reseeUx.locale.validation.tooFewOptions, { count: minRequired })),
    );
  }

  if (maxRequired) {
    checkFns.push(
      z.maxLength(maxRequired, toValidationError(reseeUx.locale.validation.tooManyOptions, { count: maxRequired })),
    );
  }

  const arraySchema = z
    .array(z.unknown(), toValidationError(reseeUx.locale.validation.required))
    .check(...checkFns);

  return requirements.required
    ? arraySchema
    : z.union([z.undefined(), z.null(), arraySchema]);
}
