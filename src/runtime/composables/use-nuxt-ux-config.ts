import { NuxtLink } from '#components';
import { type Component, isRef, shallowRef } from 'vue';


const NuxtUxConfig = {
  UiLinkBaseComponent: shallowRef<Component>(NuxtLink),
};

export type NuxtUxConfigPropName
  = keyof typeof NuxtUxConfig;

export type NuxtUxConfigPropValue<K extends NuxtUxConfigPropName>
  = (typeof NuxtUxConfig)[K];


/**
 * Exposes `getConfig` and `setConfig` methods for manipulating module-level
 * configuration at runtime.
 */
export function useNuxtUxConfig() {
  return {
    setConfig<K extends NuxtUxConfigPropName>(
      key   : K,
      value : NuxtUxConfigPropValue<K>,
    ) {
      NuxtUxConfig[key] = isRef(value) ? value : shallowRef(value);
    },

    getConfig<K extends NuxtUxConfigPropName>(key: K): NuxtUxConfigPropValue<K> {
      return NuxtUxConfig[key];
    }
  }
}
