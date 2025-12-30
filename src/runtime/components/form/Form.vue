<template>
  <Transition
    leave-active-class = "transition-opacity duration-300"
    leave-to-class     = "opacity-0"
  >
    <LazySuccessSplash
      v-if  = "props.successText && success"
      :text = "props.successText"
    />

    <div v-else>
      <LazyMessage
        v-if              = "errors?.length"
        severity          = "error"
        class             = "mb-6"
        :scroll-into-view = "true"
      >
        <slot name="error" :errors="errors">
          {{ errors.join(' ') }}
        </slot>
      </LazyMessage>

      <PrimeForm
        v-slot                    = "$form"
        v-bind                    = "$attrs"
        ref                       = "form"
        novalidate                = "true"
        :validate-on-mount        = "true"
        :validate-on-submit       = "true"
        :validate-on-value-update = "true"
        :validate-on-blur         = "false"
        :initial-values           = "props.initialValues ?? values"
        :aria-disabled            = "props.disabled"
        @submit                   = "handleFormSubmit"
      >
        <slot name="before" :state="$form" />

        <slot name="default" :state="$form">
          <FormFieldBuilder v-if="props.fields?.length" :fields="props.fields" />
        </slot>

        <slot name="after" :state="$form" />
      </PrimeForm>
    </div>
  </Transition>
</template>


<script lang="ts">
  import type { FormSubmitEvent as PrimeFormSubmitEvent } from '@primevue/forms';
  import type { FormChangeHandler, FormSubmitEvent, FormSubmitHandler, FormValues } from '../../types/form';
  import type { FormFieldBuilderOption } from './FormFieldBuilder.vue';

  export * from '../../types/form';

  export interface FormProps<T extends FormValues = FormValues> {
    disabled?      : boolean;
    onSubmit?      : FormSubmitHandler<T> | FormSubmitHandler<T>[];
    onChange?      : FormChangeHandler<T> | FormChangeHandler<T>[];
    changeDelay?   : number;
    initialValues? : Partial<T>;
    fields?        : FormFieldBuilderOption[];
    successText?   : string;
  }
</script>


<script setup lang="ts" generic="T extends FormValues">
  import PrimeForm, { type FormInstance } from '@primevue/forms/form';
  import { toNonNullableArray } from '@resee-movies/utilities/arrays/to-non-nullable-array';
  import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
  import { syncRefs } from '@vueuse/core';
  import { ref, useTemplateRef } from 'vue';
  import type { FormChangeEvent } from '../../types/form';
  import FormFieldBuilder from './FormFieldBuilder.vue';
  import LazySuccessSplash from '../SuccessSplash.vue';
  import LazyMessage from '../Message.vue';
  import { useReactiveObjectsSync } from '../../composables/use-reactive-objects-sync';
  import { provideFormInstance, getValuesFromFormState } from '../../utils/form';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<FormProps<T>>(),
    {
      disabled      : false,
      onSubmit      : undefined,
      onChange      : undefined,
      changeDelay   : 1,
      initialValues : undefined,
      fields        : undefined,
      successText   : undefined,
    },
  );

  const form    = useTemplateRef<FormInstance>('form');
  const values  = defineModel<Partial<T> | undefined>('values', { default: undefined });
  const success = ref(false);
  const errors  = ref<unknown[]>();

  defineEmits<{
    (e: 'submit', evt: FormSubmitEvent<T>): (void | Promise<void>);
    (e: 'change', evt: FormChangeEvent<T>): (void | Promise<void>);
  }>();

  const formInstance = provideFormInstance();
  syncRefs(() => props.disabled, formInstance.isDisabled);


  /**
   * The following bit implements a custom kind of v-model support for forms,
   * by binding the properties of the external reactive object with those
   * of the form's `states` object.
   */
  useReactiveObjectsSync({
    left          : () => form.value?.states,
    right         : () => values.value,
    keySource     : 'left',
    debounceMsLtr : props.changeDelay,
    onChange      : () => handleOnChange(),

    leftOptions: {
      getter(obj, key) {
        return obj[key]?.value;
      },

      setter(obj, key, val) {
        if (obj[key]) {
          obj[key].value = val ?? null;
        }
      },
    },
  });


  /**
   * Similar to `handleFormSubmit` below, but called for every change of the form's value.
   * This method is intended to be utilized in scenarios like live filtering, where having
   * a dedicated submit button isn't desired. If a promise is returned, the form will
   * temporarily disable itself until settled.
   */
  async function handleOnChange() {
    const state = form.value?.states;

    if (state && props.onChange) {
      const newEvent = {
        values : getValuesFromFormState<T>(state),
        valid  : form.value?.valid ?? true,
      };

      const results = toNonNullableArray(props.onChange)
        .map((handler) => handler(newEvent));

      if (!!results.find((result) => isPromiseLike(result))) {
        formInstance.isSubmitting.value = true;
        await Promise.allSettled(results);
        formInstance.isSubmitting.value = false;
      }
    }
  }


  /**
   * This internal event handler takes the value from the Primevue form component
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

        const result = await Promise.allSettled(results);

        if (!result.find((entry) => entry.status === 'rejected')) {
          success.value = true;
          errors.value  = undefined;
        }
        else {
          errors.value = result
            .filter((entry) => entry.status === 'rejected')
            .map((entry) => entry.reason);
        }

        formInstance.isSubmitting.value = false;
      }
    }
  }
</script>
