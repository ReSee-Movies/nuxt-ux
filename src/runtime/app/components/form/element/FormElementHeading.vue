<template>
  <div class="form-element-heading">
    <h2 class="h2">
      {{ props.heading }}
    </h2>

    <p v-if="props.subheading" class="p note">
      {{ props.subheading }}
    </p>
  </div>
</template>


<script lang="ts">
  export interface FormElementHeadingProps {
    heading     : string;
    subheading? : string;
  }
</script>


<script setup lang="ts">
  const props = withDefaults(
    defineProps<FormElementHeadingProps>(),
    {
      subheading: undefined,
    },
  );
</script>
