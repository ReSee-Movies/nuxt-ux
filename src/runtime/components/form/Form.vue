<template>
  <PrimeForm
    v-slot                    = "$form"
    novalidate                = "true"
    :validate-on-mount        = "true"
    :validate-on-submit       = "true"
    :validate-on-value-update = "true"
    :validate-on-blur         = "false"
    :initial-values           = "props.initialValues"
    :aria-disabled            = "props.disabled"
    @submit                   = "handleFormSubmit"
  >
    <slot :state="$form" />
  </PrimeForm>
</template>


<script lang="ts">
  import type { FormInstance as PrimeFormInstance, FormSubmitEvent as PrimeFormSubmitEvent } from '@primevue/forms';
  import type { Ref, InjectionKey } from 'vue';

  export type FormValues = Record<string, any>;

  export type FormSubmitEvent<T extends FormValues = FormValues> = PrimeFormSubmitEvent<T>;

  export type FormSubmitHandler<T extends FormValues = FormValues>
    = (event: FormSubmitEvent<T>) => void | Promise<void>;

  export interface FormProps<T extends FormValues = FormValues> {
    disabled?      : boolean;
    initialValues? : Record<string, unknown>;
    onSubmit?      : FormSubmitHandler<T> | FormSubmitHandler<T>[];
  }

  export interface ReseeFormInstance {
    hasBeenSubmitted : Ref<boolean>;
    isSubmitPending  : Ref<boolean>;
    isFormDisabled   : Ref<boolean>;
  }

  export const PrimeFormSymbol = '$pcForm' as unknown as InjectionKey<PrimeFormInstance>;
  export const ReseeFormSymbol = Symbol('form') as InjectionKey<ReseeFormInstance>;
</script>


<script setup lang="ts" generic="T extends FormValues">
  import PrimeForm from '@primevue/forms/form';
  import { toNonNullableArray } from '@resee-movies/utilities/arrays/to-non-nullable-array';
  import { isObjectLike } from '@resee-movies/utilities/objects/is-object-like';
  import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
  import { syncRefs } from '@vueuse/core';
  import { provide, ref, toValue, toRaw } from 'vue';

  const props = withDefaults(
    defineProps<FormProps<T>>(),
    {},
  );

  defineEmits<{
    (e: 'submit', evt: FormSubmitEvent<T>): (void | Promise<void>);
  }>();

  const extendedState: ReseeFormInstance = {
    hasBeenSubmitted : ref(false),
    isSubmitPending  : ref(false),
    isFormDisabled   : ref(false),
  };

  syncRefs(() => props.disabled, extendedState.isFormDisabled);

  provide(ReseeFormSymbol, extendedState);


  /**
   * This internal event handler takes the value from Primevue's form component
   * and performs some additional processing, because, at the time of writing,
   * the setting of `initial-value` directly on FormField instances produces some
   * really weird behavior wherein the event's `values` winds up just being whatever
   * the value of the last FormField encountered was.
   *
   * This also manages some internal state flags that other components within the
   * form use to toggle their own behavior.
   */
  async function handleFormSubmit (event: PrimeFormSubmitEvent) {
    extendedState.hasBeenSubmitted.value = true;

    if (!event.valid) {
      return;
    }

    if (props.onSubmit) {
      const handlers = toNonNullableArray(props.onSubmit);

      const values = Object.entries(event.states).reduce((acc, cur) => {
        const rawValue = toRaw(toValue(cur[1]).value);

        let value;

        if (Array.isArray(rawValue)) {
          value = Array.from(rawValue);
        }
        else if (isObjectLike(rawValue)) {
          value = { ...rawValue };
        }
        else {
          value = rawValue;
        }

        return Object.defineProperty(acc, cur[0], { value });
      }, {} as T);

      const newEvent: FormSubmitEvent<T> = { ...event, values };

      const results = handlers.map((handler) => handler(newEvent));

      if (!!results.find((result) => isPromiseLike(result))) {
        extendedState.isSubmitPending.value = true;
        await Promise.allSettled(results);
        extendedState.isSubmitPending.value = false;
      }
    }
  }
</script>
