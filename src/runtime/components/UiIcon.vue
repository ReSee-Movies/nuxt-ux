<template>
  <span role="presentation" :class="['icon', props.name]" />
</template>

<script setup lang="ts">
  const props = defineProps<{
    name: string;
  }>();
</script>

<style scoped>
  .icon {
    display     : inline-flex;
    align-items : center;

    &:before {
      content: var(--zero-width-space);
    }
  }
</style>
