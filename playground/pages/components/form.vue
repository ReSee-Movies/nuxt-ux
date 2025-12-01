<template>
  <UiForm
    v-slot  = "{ state }"
    class   = "grid grid-cols-2 gap-x-6 gap-y-8"
    @submit = "handleFormSubmit"
  >
    <UiFormFieldText name="foggle" required min-length="2" max-length="5" />
    <UiFormFieldToggleSwitch name="toggle" class="col-span-2" required />
    <UiFormFieldCheckbox name="check" class="col-span-2" required />

    <div>
      <FormSubmitButton />
    </div>

    <div class="col-span-2">
      <pre class="pre mt-8">{{ JSON.stringify(state, null, 2) }}</pre>
    </div>
  </UiForm>
</template>


<script setup lang="ts">
  import UiForm, { type FormSubmitEvent } from '#resee-ux/components/form/Form.vue';
  import UiFormFieldCheckbox from '#resee-ux/components/form/FormFieldCheckbox.vue';
  import UiFormFieldText from '#resee-ux/components/form/FormFieldText.vue';
  import UiFormFieldToggleSwitch from '#resee-ux/components/form/FormFieldToggleSwitch.vue';
  import FormSubmitButton from '#resee-ux/components/form/FormSubmitButton.vue';
  import { sleep } from '@resee-movies/utilities/timers/sleep';

  definePageMeta({
    heading: 'Form',
  });

  async function handleFormSubmit(event: FormSubmitEvent) {
    console.log(event.values);
    await sleep(5000);
  }
</script>
