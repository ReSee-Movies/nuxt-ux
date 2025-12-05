<template>
  <PrimeForm
    v-slot                    = "$form"
    ref                       = "form"
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
  import type { FormSubmitEvent as PrimeFormSubmitEvent } from '@primevue/forms';
  import type { FormValues, FormSubmitHandler, FormSubmitEvent } from '../../types/form';

  export * from '../../types/form';

  export interface FormProps<T extends FormValues = FormValues> {
    disabled?         : boolean;
    initialValues?    : Record<string, unknown>;
    onSubmit?         : FormSubmitHandler<T> | FormSubmitHandler<T>[];
    onChange?         : (values: T | null) => void;
    onChangeDebounce? : number,
  }
</script>


<script setup lang="ts" generic="T extends FormValues">
  import PrimeForm, { type FormInstance } from '@primevue/forms/form';
  import { toNonNullableArray } from '@resee-movies/utilities/arrays/to-non-nullable-array';
  import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
  import { syncRefs, watchDebounced } from '@vueuse/core';
  import { useTemplateRef, watchEffect } from 'vue';
  import { provideFormInstance, getValuesFromFormState } from '../../utils/form';

  const props = withDefaults(
    defineProps<FormProps<T>>(),
    {
      onChangeDebounce: 32,
    },
  );

  defineEmits<{
    (e: 'submit', evt: FormSubmitEvent<T>): (void | Promise<void>);
    (e: 'change', values: T): void;
  }>();

  const formInstance = provideFormInstance();
  syncRefs(() => props.disabled, formInstance.isDisabled);


  /**
   * The following bit implements an `onChange` event for the form, which is
   * designed to fire any time that the values of the form fields are altered.
   *
   * Primevue doesn't provide direct access to the watchers that it sets up
   * for itself, unfortunately, so we're tracking the reactive `states` object
   * that it creates. This is a very chatty object, since it carries a lot more
   * than just the field values, so we're trying to be as efficient as is practical
   * with the whole thing.
   */
  const form = useTemplateRef<FormInstance>('form');

  // Watching reactive objects means that we cannot use the newValue/oldValue arguments
  // of the callback, because they both point to the same thing.
  let oldValues: string | undefined = undefined;

  const changeHandles = watchDebounced(
    () => form.value?.states,
    (newState) => {
      const newValues = newState ? getValuesFromFormState<T>(newState) : null;
      const stringify = JSON.stringify(newValues);

      if (stringify !== oldValues) {
        props.onChange?.(newValues);
        oldValues = stringify;
      }
    },
    {
      debounce : props.onChangeDebounce,
      deep     : 2,
    },
  );

  watchEffect(() => {
    changeHandles[props.onChange ? 'resume' : 'pause']();
  });

  /**
   * This internal event handler takes the value from Primevue's form component
   * and performs some additional processing, because, at the time of writing,
   * the setting of `initial-value` directly on FormField instances produces some
   * really weird behavior wherein the event's `values` winds up just being whatever
   * the value of the last FormField encountered was.
   *
   * This also manages some internal state flags that other components within the
   * form use to augment their own behavior.
   */
  async function handleFormSubmit (event: PrimeFormSubmitEvent) {
    if (props.disabled) {
      return;
    }

    formInstance.hasSubmitted.value = true;

    if (!event.valid) {
      return;
    }

    if (props.onSubmit) {
      const handlers = toNonNullableArray(props.onSubmit);
      const values   = getValuesFromFormState<T>(event.states);
      const newEvent = { ...event, values } as FormSubmitEvent<T>;
      const results  = handlers.map((handler) => handler(newEvent));

      if (!!results.find((result) => isPromiseLike(result))) {
        formInstance.isSubmitting.value = true;
        await Promise.allSettled(results);
        formInstance.isSubmitting.value = false;
      }
    }
  }
</script>
