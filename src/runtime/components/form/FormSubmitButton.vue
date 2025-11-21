<template>
  <Button v-bind="props" type="submit" :loading="isSubmitPending" />
</template>


<script lang="ts">
  import type { ButtonProps } from '../Button.vue';
  export interface FormSubmitButtonProps extends Omit<ButtonProps, 'onClick' | 'loading'> {}
</script>


<script setup lang="ts">
  import { inject } from 'vue';
  import Button from '../Button.vue';
  import { ReseeFormSymbol } from './Form.vue';

  const props = withDefaults(
    defineProps<FormSubmitButtonProps>(),
    {
      text     : 'Submit',
      bordered : true,
    },
  );

  const { isSubmitPending } = inject(ReseeFormSymbol) ?? {};
</script>
