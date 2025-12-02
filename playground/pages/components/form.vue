<template>
  <UiForm
    v-slot  = "{ state }"
    class   = "grid grid-cols-2 gap-x-6 gap-y-8"
    @submit = "handleFormSubmit"
  >
    <UiFormFieldText name="foggle" />

    <UiFormFieldSelect
      name        = "countries"
      class       = "col-span-2"
      :options    = "selectOptions"
      placeholder = "Select an option"
    />

    <UiFormFieldToggleSwitch name="toggle" class="col-span-2" />
    <UiFormFieldCheckbox name="check" class="col-span-2" />

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
  import UiFormFieldSelect from '#resee-ux/components/form/FormFieldSelect.vue';
  import FormSubmitButton from '#resee-ux/components/form/FormSubmitButton.vue';
  import { sleep } from '@resee-movies/utilities/timers/sleep';

  definePageMeta({
    heading: 'Form',
  });

  async function handleFormSubmit(event: FormSubmitEvent) {
    console.log(event.values);
    await sleep(500000);
  }

  const selectOptions = Array.from({ length: 300 }, (_, idx) => `Option ${ idx + 1 }`);
</script>
