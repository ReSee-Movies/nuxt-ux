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
  import type { FormSubmitEvent as PrimeFormSubmitEvent } from '@primevue/forms';
  import type { FormValues, FormSubmitHandler, FormSubmitEvent } from '../../types/form';

  export * from '../../types/form';

  export interface FormProps<T extends FormValues = FormValues> {
    disabled?      : boolean;
    initialValues? : Record<string, unknown>;
    onSubmit?      : FormSubmitHandler<T> | FormSubmitHandler<T>[];
  }
</script>


<script setup lang="ts" generic="T extends FormValues">
  import PrimeForm from '@primevue/forms/form';
  import { toNonNullableArray } from '@resee-movies/utilities/arrays/to-non-nullable-array';
  import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
  import { syncRefs } from '@vueuse/core';
  import { provideFormInstance, getValuesFromFormState } from '../../utils/form';

  const props = withDefaults(
    defineProps<FormProps<T>>(),
    {},
  );

  defineEmits<{
    (e: 'submit', evt: FormSubmitEvent<T>): (void | Promise<void>);
  }>();

  const formInstance = provideFormInstance();
  syncRefs(() => props.disabled, formInstance.isDisabled);

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
