<template>
  <PrimeForm
    v-slot                    = "$form"
    ref                       = "form"
    novalidate                = "true"
    :validate-on-mount        = "true"
    :validate-on-submit       = "true"
    :validate-on-value-update = "true"
    :validate-on-blur         = "false"
    :initial-values           = "values"
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
    disabled? : boolean;
    onSubmit? : FormSubmitHandler<T> | FormSubmitHandler<T>[];
    onChange? : (values: T | null) => void;
  }
</script>


<script setup lang="ts" generic="T extends FormValues">
  import PrimeForm, { type FormInstance } from '@primevue/forms/form';
  import { toNonNullableArray } from '@resee-movies/utilities/arrays/to-non-nullable-array';
  import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
  import { syncRefs, useDebounceFn } from '@vueuse/core';
  import { useTemplateRef } from 'vue';
  import { useReactiveObjectsSync } from '../../composables/use-reactive-objects-sync';
  import { provideFormInstance, getValuesFromFormState } from '../../utils/form';

  const props = withDefaults(
    defineProps<FormProps<T>>(),
    {},
  );

  const form   = useTemplateRef<FormInstance>('form');
  const values = defineModel<Partial<T> | undefined>('values', { default: undefined });

  defineEmits<{
    (e: 'submit', evt: FormSubmitEvent<T>): (void | Promise<void>);
    (e: 'change', values: T): void;
  }>();

  const formInstance = provideFormInstance();
  syncRefs(() => props.disabled, formInstance.isDisabled);


  const emitOnChange = useDebounceFn(() => {
    const state = form.value?.states;

    if (state) {
      props.onChange?.(getValuesFromFormState<T>(state));
    }
  }, 1);


  /**
   * The following bit implements a custom kind of v-model support for forms,
   * by binding the properties of the external reactive object with those
   * of the form's `states` object.
   */
  useReactiveObjectsSync({
    left      : () => form.value?.states,
    right     : () => values.value,
    keySource : 'left',

    leftOptions: {
      onChange: () => emitOnChange(),

      getter(obj, key) {
        return obj[key]?.value;
      },

      setter(obj, key, val) {
        if (obj[key]) {
          obj[key].value = val ?? null;
        }
      },
    },

    rightOptions: {
      onChange: () => emitOnChange(),
    },
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
