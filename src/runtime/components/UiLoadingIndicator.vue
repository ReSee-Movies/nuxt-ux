<template>
  <PrimeProgressSpinner :class="['indicator', props.size]" />
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      size?: 'sm' | 'md' | 'xl';
    }>(),
    {
      size: 'md',
    },
  );
</script>

<style scoped>
  .indicator.sm {
    height : 1rem;
    width  : 1rem;

    &:deep(circle) {
      stroke-width: 7;
    }
  }

  .indicator.md {
    height : 1.5rem;
    width  : 1.5rem;

    &:deep(circle) {
      stroke-width: 5;
    }
  }

  .indicator.xl {
    height : 3rem;
    width  : 3rem;

    &:deep(circle) {
      stroke-width: 4;
    }
  }

  .indicator :deep(svg) {
    animation          : var(--animate-spin);
    animation-duration : 2s;
  }

  .indicator :deep(circle) {
    stroke-linecap: round;

    animation:
      resee-color-wheel 12s ease-in-out infinite,
      dashed-wheel 6s var(--default-transition-timing-function) infinite;
  }

  @keyframes resee-color-wheel {
      0% { stroke: var(--color-resee-red); }
     11% { stroke: var(--color-resee-orange); }
     22% { stroke: var(--color-resee-yellow); }
     33% { stroke: var(--color-resee-green); }
     44% { stroke: var(--color-resee-seaweed); }
     55% { stroke: var(--color-resee-aqua); }
     66% { stroke: var(--color-resee-blue); }
     77% { stroke: var(--color-resee-indigo); }
     88% { stroke: var(--color-resee-violet); }
    100% { stroke: var(--color-resee-red); }
  }

  @keyframes dashed-wheel {
    0% {
      stroke-dasharray  : 1, 150;
      stroke-dashoffset : 0;
    }

    50% {
      stroke-dasharray  : 120, 150;
      stroke-dashoffset : -35px;
    }

    100% {
      stroke-dasharray  : 120, 150;
      stroke-dashoffset : -124px;
    }
  }
</style>
