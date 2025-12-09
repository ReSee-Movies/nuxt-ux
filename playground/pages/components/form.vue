<template>
  <UiForm v-model:values="values" :fields="formFields" @submit="handleFormSubmit">
    <template #after="$form">
      <div>
        <hr class="hr">

        <div class="text-right">
          <UiButton text="Flyout Form" @click="showDrawer = true" />
        </div>

        <hr class="hr">

        <h2 class="h3">Bound Model</h2>
        <pre class="pre overflow-x-auto">{{ JSON.stringify(values, null, 2) }}</pre>

        <hr class="hr">

        <h2 class="h3">Form State</h2>
        <pre class="pre overflow-x-auto">{{ JSON.stringify($form, null, 2) }}</pre>
      </div>
    </template>
  </UiForm>


  <UiDrawer v-model:visible="showDrawer" position="right" header="Flyout Form">
    <div class="px-1">
      <UiForm :fields="formFields" @submit="handleFormSubmit" />
    </div>
  </UiDrawer>
</template>


<script setup lang="ts">
  import UiButton from '#resee-ux/components/Button.vue';
  import UiDrawer from '#resee-ux/components/Drawer.vue';
  import UiForm, { type FormSubmitEvent } from '#resee-ux/components/form/Form.vue';
  import type { FormFieldBuilderOption } from '#resee-ux/components/form/FormFieldBuilder.vue';
  import { useNotification } from '#resee-ux/composables/use-notification';
  import { getRegionalIndicatorUnicodeSymbol } from '@resee-movies/utilities/geo/get-regional-indicator-unicode-symbol';
  import { sleep } from '@resee-movies/utilities/timers/sleep';
  import { reactive, ref } from 'vue';

  definePageMeta({
    heading: 'Form',
  });

  const { notifySuccess } = useNotification();

  const showDrawer = ref(false);

  const values = reactive({
    firstName      : 'Bob',
    surname        : 'Loblaw',
    journeyType    : 'Round Trip',
    additionalInfo : 'Hello World',
    toppings       : undefined,
  });

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
      required  : true,
      width     : 'half',
    },
    {
      fieldType : 'text',
      name      : 'surname',
      required  : true,
      width     : 'half',
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
    },
    {
      fieldType : 'radio',
      name      : 'toppings',
      options   : ['Mushrooms', 'Onions', 'Sprouts', 'Pineapple'],
    },
    {
      fieldType : 'toggle',
      name      : 'notifications',
      label     : 'Allow Notifications',
    },
    {
      fieldType : 'checkbox',
      name      : 'termsOfService',
      label     : 'I agree to the terms of service',
      required  : true,
    },
    {
      fieldType : 'textarea',
      name      : 'additionalInfo',
    },
    {
      fieldType: 'submit',
    },
  ];


  async function handleFormSubmit(event: FormSubmitEvent) {
    await sleep(3000);

    notifySuccess(JSON.stringify(event.values, null, 2), { headline: 'Form Submitted' });

    if (showDrawer.value) {
      showDrawer.value = false;
    }
  }
</script>
