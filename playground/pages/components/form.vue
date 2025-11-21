<template>
  <UiForm
    v-slot  = "{ state }"
    class   = "grid grid-cols-2 gap-x-6 gap-y-8"
    @submit = "handleFormSubmit"
  >
    <UiFormFieldText name="firstName" initial-value="Tobias" required />
    <UiFormFieldText name="lastName" initial-value="Funk" required />

    <UiFormCheckbox name="accept" value="foo" label="Accept Foo" class="col-span-2" />
    <UiFormCheckbox name="accept" value="bar" label="Accept Bar" class="col-span-2" />

    <UiFormToggleSwitch name="activate" class="col-span-2" />

    <div>
      <UiFormSubmitButton />
    </div>

    <div class="col-span-2">
      <pre class="pre mt-8">{{ JSON.stringify(state, null, 2) }}</pre>
    </div>
  </UiForm>
</template>


<script setup lang="ts">
  import UiForm, { type FormSubmitEvent } from '#resee-ux/components/form/Form.vue';
  import UiFormCheckbox from '#resee-ux/components/form/FormFieldCheckbox.vue';
  import UiFormFieldText from '#resee-ux/components/form/FormFieldText.vue';
  import UiFormSubmitButton from '#resee-ux/components/form/FormSubmitButton.vue';
  import UiFormToggleSwitch from '#resee-ux/components/form/FormFieldToggleSwitch.vue';
  import { sleep } from '@resee-movies/utilities/timers/sleep';

  definePageMeta({
    heading: 'Form',
  });

  async function handleFormSubmit(event: FormSubmitEvent) {
    console.log(event.values);
    await sleep(5000);
  }
</script>
