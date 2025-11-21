<template>
  <UiForm v-slot="{ isValid }" :initial-values="{ firstName: '' }" @submit="handleFormSubmit">
    {{ isValid }}
    <hr class="hr">

    <UiFormField v-slot="{ inputId, messageId, disabled, readonly }" name="firstName" required>
      <PrimeInputText :id="inputId" :aria-describedby="messageId" :disabled="disabled" :readonly="readonly" required />
    </UiFormField>

    <input type="submit" />
  </UiForm>
</template>


<script setup lang="ts">
  import UiForm from '#resee-ux/components/form/Form.vue';
  import UiFormField from '#resee-ux/components/form/FormField.vue';
  import { sleep } from '@resee-movies/utilities/timers/sleep';

  definePageMeta({
    heading: 'Form',
  });


  async function handleFormSubmit() {
    await sleep(5000);
  }
</script>
