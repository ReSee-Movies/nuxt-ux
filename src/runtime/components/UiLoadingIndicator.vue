<template>
  <PrimeProgressSpinner :class="['indicator', props.size]" />
</template>

<script setup lang="ts">
  import { ProgressSpinner as PrimeProgressSpinner } from 'primevue';
  import type { UiIconProps } from './UiIcon.vue';

  const props = withDefaults(
    defineProps<{
      size?: UiIconProps['size'];
    }>(),
    {
      size: 'md',
    },
  );
</script>

<style scoped>
  @reference "tailwindcss";

  .indicator.sm {
    height : var(--icon-size-small);
    width  : var(--icon-size-small);

    &:deep(circle) {
      stroke-width: 7;
    }
  }

  .indicator.md {
    height : var(--icon-size-medium);
    width  : var(--icon-size-medium);

    &:deep(circle) {
      stroke-width: 7;
    }
  }

  .indicator.lg {
    height : var(--icon-size-large);
    width  : var(--icon-size-large);

    &:deep(circle) {
      stroke-width: 5;
    }
  }

  .indicator.xl {
    height : var(--icon-size-jumbo);
    width  : var(--icon-size-jumbo);

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
