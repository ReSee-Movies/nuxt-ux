<template>
  <Button v-bind="props" type="submit" :loading="formState.isSubmitting.value" />
</template>


<script lang="ts">
  import type { ButtonProps } from '../Button.vue';
  export interface FormSubmitButtonProps extends Omit<ButtonProps, 'onClick' | 'loading'> {}
</script>


<script setup lang="ts">
  import { injectFormInstance } from '../../utils/form';
  import Button from '../Button.vue';

  const props = withDefaults(
    defineProps<FormSubmitButtonProps>(),
    {
      text     : 'Submit',
      bordered : true,
    },
  );

  const formState = injectFormInstance();
</script>
