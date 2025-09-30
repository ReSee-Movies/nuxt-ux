<template>
  <Component :is="tagName" :class="`h${ props.level }`">
    <slot>{{ props.text }}</slot>
  </Component>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  // For Tailwind
  // h1, h2, h3, h4, h5, h6

  const props = withDefaults(
    defineProps<{
      text?  : string | null;
      level? : '1' | '2' | '3' | '4' | '5' | '6' | 1 | 2 | 3 | 4 | 5 | 6;
    }>(),
    {
      text  : undefined,
      level : '1',
      class : undefined,
    },
  );

  const tagName = computed(() => {
    return `h${ props.level }`;
  });
</script>
