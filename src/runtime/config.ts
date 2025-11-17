import { NuxtLink } from '#components';
import { type Component } from 'vue';
import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';


/**
 * Runtime constants can be set once and then used throughout this package.
 */
export type ReseeUxRuntimeConstants = {
  UiLinkBaseComponent: Component;
};

export type ConstantsKey = keyof ReseeUxRuntimeConstants;

export type ConstantsValue<K extends ConstantsKey> = ReseeUxRuntimeConstants[K];


const RuntimeConstants: ReseeUxRuntimeConstants = {
  UiLinkBaseComponent: NuxtLink,
};


/**
 * Set one or more ReSee UX package global constants.
 */
export function setReseeUxConstant(values: Partial<ReseeUxRuntimeConstants>): void;
export function setReseeUxConstant<K extends ConstantsKey>(key: K, value: ConstantsValue<K>): void;

export function setReseeUxConstant<
  K extends ConstantsKey,
>(
  keyOrObject: K | Partial<ReseeUxRuntimeConstants>,
  valueOrUndef?: ConstantsValue<K>,
): void {
  if (isObjectLike(keyOrObject)) {
    Object.assign(RuntimeConstants, keyOrObject);
  }
  else if (valueOrUndef) {
    RuntimeConstants[keyOrObject] = valueOrUndef;
  }
}


/**
 * Retrieve a ReSee UX package global constant.
 */
export function getReseeUxConstant<K extends ConstantsKey>(key: K): ConstantsValue<K> {
  return RuntimeConstants[key];
}
