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
    <slot :isValid="$form.valid" />
  </PrimeForm>
</template>


<script lang="ts">
  import type { FormInstance as PrimeFormInstance, FormSubmitEvent as PrimeFormSubmitEvent } from '@primevue/forms';
  import type { Ref, InjectionKey } from 'vue';

  export type FormSubmitHandler
    = (evt: PrimeFormSubmitEvent) => void | Promise<void>;

  export interface FormProps {
    disabled?      : boolean;
    initialValues? : Record<string, unknown>;
    onSubmit?      : FormSubmitHandler | FormSubmitHandler[];
  }

  export interface ReseeFormInstance {
    hasBeenSubmitted : Ref<boolean>;
    isSubmitPending  : Ref<boolean>;
    isFormDisabled   : Ref<boolean>;
  }

  export const PrimeFormSymbol = '$pcForm' as unknown as InjectionKey<PrimeFormInstance>;
  export const ReseeFormSymbol = Symbol('form') as InjectionKey<ReseeFormInstance>;
</script>


<script setup lang="ts">
  import PrimeForm from '@primevue/forms/form';
  import { toNonNullableArray } from '@resee-movies/utilities/arrays/to-non-nullable-array';
  import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
  import { syncRefs } from '@vueuse/core';
  import { provide, ref } from 'vue';

  const props = withDefaults(
    defineProps<FormProps>(),
    {},
  );

  defineEmits<{
    (e: 'submit', evt: PrimeFormSubmitEvent): (void | Promise<void>);
  }>();

  const extendedState: ReseeFormInstance = {
    hasBeenSubmitted : ref(false),
    isSubmitPending  : ref(false),
    isFormDisabled   : ref(false),
  };

  syncRefs(() => props.disabled, extendedState.isFormDisabled);

  provide(ReseeFormSymbol, extendedState);

  async function handleFormSubmit(evt: PrimeFormSubmitEvent) {
    extendedState.hasBeenSubmitted.value = true;

    if (!evt.valid) {
      return;
    }

    if (props.onSubmit) {
      const handlers = toNonNullableArray(props.onSubmit);
      const results  = handlers.map((handler) => handler(evt));

      if (!!results.find((result) => isPromiseLike(result))) {
        extendedState.isSubmitPending.value = true;
        await Promise.allSettled(results);
        extendedState.isSubmitPending.value = false;
      }
    }
  }
</script>


<style>
  input {
    color: black;
    background-color: white;
  }
</style>
