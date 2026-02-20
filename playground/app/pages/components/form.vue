<template>
  <UiForm
    :values       = "queryParams"
    :fields       = "formFields"
    :change-delay = "1300"
    success-text  = "Thank you for the feedback"
    @submit       = "handleFormSubmit"
  >
    <template #after="$form">
      <div>
        <hr class="hr">

        <div class="text-right">
          <UiButton text="Flyout Form" @click="showDrawer = true" />
        </div>

        <hr class="hr">

        <h2 class="h3">Bound Model</h2>
        <pre class="pre overflow-x-auto">{{ JSON.stringify(queryParams, null, 2) }}</pre>

        <hr class="hr">

        <h2 class="h3">Form State</h2>
        <pre class="pre overflow-x-auto">{{ JSON.stringify($form, null, 2) }}</pre>
      </div>
    </template>
  </UiForm>

  <UiDrawer v-model:visible="showDrawer" position="right" header="Flyout Form">
    <div class="px-1">
      <UiForm
        :fields      = "formFields"
        success-text = "Thank you for the feedback"
        @submit      = "handleFormSubmit"
      />
    </div>
  </UiDrawer>
</template>


<script setup lang="ts">
  import UiButton from '#resee-ux/components/Button.vue';
  import UiDrawer from '#resee-ux/components/Drawer.vue';
  import UiForm, { type FormSubmitEvent } from '#resee-ux/components/form/Form.vue';
  import type { FormFieldBuilderOption } from '#resee-ux/components/form/FormFieldBuilder.vue';
  import { useNotification } from '#resee-ux/composables/use-notification';
  import { useQueryParameters } from '#resee-ux/composables/use-query-parameters';
  import { getRegionalIndicatorUnicodeSymbol } from '@resee-movies/utilities/geo/get-regional-indicator-unicode-symbol';
  import { sleep } from '@resee-movies/utilities/timers/sleep';
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Form',
  });

  const queryParams = useQueryParameters({
    firstName   : { type: String, persist: true },
    surname     : { type: String },
    country     : { type: [String], persist: true },
    journeyType : { type: String },
  });

  const { notifyInfo } = useNotification();

  const showDrawer = ref(false);

  const countryOptions = [
    { label: `${ getRegionalIndicatorUnicodeSymbol('au') } Australia`,      value: 'AU' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('ca') } Canada`,         value: 'CA' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('fr') } France`,         value: 'FR' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('de') } Germany`,        value: 'DE' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('jp') } Japan`,          value: 'JP' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('mx') } Mexico`,         value: 'MX' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('gb') } United Kingdom`, value: 'GB' },
    { label: `${ getRegionalIndicatorUnicodeSymbol('us') } United States`,  value: 'US' },
  ];

  const journeyTypes = [
    { label: 'One Way',    icon: 'i-ph-arrow-right' },
    { label: 'Round Trip', icon: 'i-ph-arrows-left-right' },
    { label: 'Multi-City', icon: 'i-ph-dots-nine' },
  ];

  const formFields: FormFieldBuilderOption[] = [
    {
      fieldType : 'text',
      name      : 'firstName',
      width     : 'half',
      noteText  : 'Here is some interesting info',
      required  : true,
      minLength : 5,
    },
    {
      fieldType : 'text',
      name      : 'surname',
      width     : 'half',
      required  : true,
    },
    {
      fieldType   : 'select',
      name        : 'country',
      options     : countryOptions,
      placeholder : 'Select an option',
      optionLabel : 'label',
      optionValue : 'value',
      multiple    : true,
      maxRequired : 2,
      width       : 'half',
    },
    {
      fieldType      : 'select-button',
      name           : 'journeyType',
      options        : journeyTypes,
      optionLabel    : 'label',
      optionValue    : 'label',
      optionDisabled : 'disabled',
      optionIcon     : 'icon',
      iconOnly       : true,
      multiple       : false,
      width          : 'half',
      noteText       : 'Here is some interesting info'
    },
    {
      fieldType : 'radio',
      name      : 'toppings',
      options   : ['Mushrooms', 'Onions', 'Sprouts', 'Pineapple'],
      noteText  : 'Here is some interesting info'
    },
    {
      fieldType : 'toggle',
      name      : 'notifications',
      label     : 'Allow Notifications',
      noteText  : 'Here is some interesting info'
    },
    {
      fieldType : 'checkbox',
      name      : 'termsOfService',
      label     : 'I agree to the terms of service',
      required  : true,
      noteText  : 'Here is some interesting info'
    },
    {
      fieldType : 'textarea',
      name      : 'additionalInfo',
    },
    {
      fieldType   : 'checkbox-group',
      name        : 'numberedOptions',
      options     : ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
      maxRequired : 3,
    },
    {
      fieldType: 'submit',
    },
  ];

  async function handleFormSubmit(event: FormSubmitEvent) {
    await sleep(1000);

    if (event.values.firstName?.toLowerCase() === 'danger') {
      throw new Error('Well that was not suppose to happen.');
    }

    notifyInfo(JSON.stringify(event.values, null, 2), {
      headline: 'Submitted Information',
    });

    if (showDrawer.value) {
      setTimeout(() => {
        showDrawer.value = false;
      }, 5000);
    }
  }
</script>
