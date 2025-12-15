<template>
  <PrimeTag
    :class="[
      'tag',
      'status-indicating',
      props.severity,
      props.size,
      props.tooltip ? 'has-tooltip' : undefined
    ]"
    v-prime-tooltip.top="{ value: props.tooltip, showDelay: 500 }"
  >
    <IconTextPair :icon="props.icon" :text="props.text" />
  </PrimeTag>
</template>

<script lang="ts">
  import type { StyleStatusLevel } from '../types';

  export interface TagProps {
    text?     : string;
    icon?     : string;
    severity? : StyleStatusLevel;
    size?     : 'sm' | 'md' | 'lg';
    tooltip?  : string;
  }
</script>

<script setup lang="ts">
  import PrimeTag from 'primevue/tag';
  import vPrimeTooltip from 'primevue/tooltip';
  import IconTextPair from './IconTextPair.vue';

  const props = withDefaults(
    defineProps<TagProps>(),
    {
      text     : undefined,
      icon     : undefined,
      severity : undefined,
      size     : 'sm',
      tooltip  : undefined,
    },
  );
</script>

<style scoped>
  @reference "tailwindcss";

  @layer components {
    .tag {
      padding     : --spacing(0.5) --spacing(1);
      user-select : all;
      cursor      : default;
    }

    .tag.sm {
      font-size: 0.85rem;
    }

    .tag.lg {
      font-size: 1.1rem;
    }

    .tag.has-tooltip {
      cursor: help;
    }
  }
</style>
