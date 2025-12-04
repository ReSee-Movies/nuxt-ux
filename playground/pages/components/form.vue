<template>
  <UiForm
    v-slot  = "{ state }"
    class   = "grid sm:grid-cols-2 gap-y-6 gap-x-4"
    @submit = "handleFormSubmit"
  >
    <UiFormFieldText name="firstName" />
    <UiFormFieldText name="surname" />

    <UiFormFieldSelect
      name         = "country"
      :options     = "countryOptions"
      placeholder  = "Select an option"
      option-label = "label"
      option-value = "value"
    />

    <UiFormFieldToggleSwitch
      name  = "notifications"
      label = "Allow Notifications"
      class = "sm:col-span-2"
    />

    <UiFormFieldCheckbox
      name  = "termsOfService"
      label = "I agree to the terms of service"
      class = "sm:col-span-2"
    />

    <div class="sm:col-span-2">
      <div class="text-right">
        <FormSubmitButton />
      </div>

      <hr class="hr">

      <div class="text-right">
        <UiButton text="Flyout Form" @click="showDrawer = true" />
      </div>

      <hr class="hr">

      <pre class="pre overflow-x-auto">{{ JSON.stringify(state, null, 2) }}</pre>
    </div>
  </UiForm>

  <UiDrawer v-model:visible="showDrawer" position="right" header="Flyout Form">
    <UiForm class="flex flex-col gap-6 px-1" @submit="handleFormSubmit">
      <UiFormFieldText name="optionA" />
      <UiFormFieldText name="optionB" />

      <UiFormFieldSelect
        name         = "optionC"
        :options     = "countryOptions"
        placeholder  = "Select an option"
        option-label = "label"
        option-value = "value"
      />

      <FormSubmitButton />
    </UiForm>
  </UiDrawer>
</template>


<script setup lang="ts">
  import UiButton from '#resee-ux/components/Button.vue';
  import UiDrawer from '#resee-ux/components/Drawer.vue';
  import UiForm, { type FormSubmitEvent } from '#resee-ux/components/form/Form.vue';
  import UiFormFieldCheckbox from '#resee-ux/components/form/FormFieldCheckbox.vue';
  import UiFormFieldText from '#resee-ux/components/form/FormFieldText.vue';
  import UiFormFieldToggleSwitch from '#resee-ux/components/form/FormFieldToggleSwitch.vue';
  import UiFormFieldSelect from '#resee-ux/components/form/FormFieldSelect.vue';
  import FormSubmitButton from '#resee-ux/components/form/FormSubmitButton.vue';
  import { useNotification } from '#resee-ux/composables/use-notification';
  import { sleep } from '@resee-movies/utilities/timers/sleep';
  import { getRegionalIndicatorUnicodeSymbol } from '@resee-movies/utilities/geo/get-regional-indicator-unicode-symbol';
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Form',
  });

  const { notifySuccess } = useNotification();

  const showDrawer = ref(false);

  const countryOptions = [
    { label: `${ getRegionalIndicatorUnicodeSymbol('ca') } Canada`, value: 'CA' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('mx') } Mexico`, value: 'MX' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('us') } United States`, value: 'US' },
  ];

  async function handleFormSubmit(event: FormSubmitEvent) {
    await sleep(3000);

    notifySuccess(JSON.stringify(event.values, null, 2), { headline: 'Form Submitted', lifetime: 0 });

    if (showDrawer.value) {
      showDrawer.value = false;
    }
  }
</script>
