<template>
  <div class="flex flex-col gap-8">
    <UiProgressBar
      :indeterminate = "indeterminate"
      :value         = "currentValue"
    />

    <div class="flex gap-4">
      <UiButton
        :text  = "`Indeterminate (${ indeterminate ? 'On' : 'Off' })`"
        @click = "indeterminate = !indeterminate"
      />

      <div>
        <input
          v-model     = "currentValue"
          class       = "input-control w-24"
          type        = "number"
          placeholder = "Value"
        >
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
  import { ref } from 'vue';

  definePageMeta({
    heading: 'ProgressBar',
  });

  const indeterminate = ref(true);
  const currentValue  = ref<number>();
</script>
