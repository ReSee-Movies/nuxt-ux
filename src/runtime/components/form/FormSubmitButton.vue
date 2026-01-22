<template>
  <Button
    type      = "submit"
    :text     = "props.text ?? reseeUx.locale.form.submitButtonLabel"
    :loading  = "formState.isSubmitting.value"
    :disabled = "formState.isDisabled.value"
    :bordered = "props.bordered"
  />
</template>


<script lang="ts">
  import type { ButtonProps } from '../Button.vue';
  export interface FormSubmitButtonProps extends /* @vue-ignore */ Omit<ButtonProps, 'onClick' | 'loading'> {
    text?     : string;
    bordered? : boolean;
  }
</script>


<script setup lang="ts">
  import { useReseeUxStore } from '../../stores/use-resee-ux-store';
  import { injectFormInstance } from '../../utils/form';
  import Button from '../Button.vue';

  const props = withDefaults(
    defineProps<FormSubmitButtonProps>(),
    {
      text     : undefined,
      bordered : true,
    },
  );

  const formState = injectFormInstance();
  const reseeUx   = useReseeUxStore();
</script>
