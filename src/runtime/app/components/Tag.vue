<template>
  <PrimeTag
    v-prime-tooltip.top="{ value: props.tooltip, showDelay: 500 }"
    :class="[
      'tag',
      props.severity,
      props.size,
      {
        'status-indicating' : props.chip,
        'has-tooltip'       : props.tooltip,
      },
    ]"
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
    chip?     : boolean;
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
      chip     : true,
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
