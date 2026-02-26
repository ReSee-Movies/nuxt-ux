<template>
  <div class="flex flex-col gap-4">
    <div>
      <p class="p lead">
        Linear Gradient (to right)
      </p>
      <div class="h-24 resee-bg-linear-to-r" />
    </div>

    <div>
      <p class="p lead">
        Conic Gradient
      </p>
      <div class="h-96 w-96 resee-bg-conic-0" />
    </div>
  </div>
</template>


<script setup lang="ts">
  definePageMeta({
    heading: 'Gradients',
  });
</script>
