<template>
  <div :id="props.id" :class="props.class" :style="props.style">
    <slot />
  </div>
</template>


<script lang="ts">
  import type { StyleValue } from '@vue/runtime-dom';
  import type { HTMLElementClassNames } from '../../../types';

  export interface FormElementEmptyDivProps {
    id?    : string;
    class? : HTMLElementClassNames;
    style? : StyleValue;
  }
</script>


<script setup lang="ts">
  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<FormElementEmptyDivProps>();
</script>
