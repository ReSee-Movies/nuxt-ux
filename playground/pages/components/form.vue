<template>
  <UiForm @submit="handleFormSubmit">
    <UiFormFieldText name="firstName" initial-value="Tobias" />
    <UiFormFieldText name="lastName" initial-value="Funk" />
    <UiFormSubmitButton />
  </UiForm>
</template>


<script setup lang="ts">
  import UiForm, { type FormSubmitEvent } from '#resee-ux/components/form/Form.vue';
  import UiFormFieldText from '#resee-ux/components/form/FormFieldText.vue';
  import UiFormSubmitButton from '#resee-ux/components/form/FormSubmitButton.vue';
  import { sleep } from '@resee-movies/utilities/timers/sleep';

  definePageMeta({
    heading: 'Form',
  });

  async function handleFormSubmit(event: FormSubmitEvent) {
    console.log(event.values);
    await sleep(5000);
  }
</script>
