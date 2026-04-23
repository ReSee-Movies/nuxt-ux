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
        'dismissible'       : props.dismissible,
      },
    ]"
  >
    <slot>
      <IconTextPair :icon="props.icon" :text="props.text" />
    </slot>

    <button
      v-if        = "props.dismissible"
      class       = "close leading-0 p-0.5"
      :aria-label = "reseeStore.getLocaleString('removeDescribe', { describe: props.text })"
      :title      = "reseeStore.getLocaleString('removeDescribe', { describe: props.text })"
      @click      = "() => emits('dismiss')"
    >
      <Icon class="i-ph-x" />
    </button>
  </PrimeTag>
</template>

<script lang="ts">
  import type { StyleStatusLevel } from '../types';

  export interface TagProps {
    text?        : string;
    icon?        : string;
    severity?    : StyleStatusLevel;
    size?        : 'sm' | 'md' | 'lg';
    tooltip?     : string;
    chip?        : boolean;
    dismissible? : boolean;
  }

  export interface TagEmits {
    (e: 'dismiss'): void;
  }
</script>

<script setup lang="ts">
  import PrimeTag from 'primevue/tag';
  import vPrimeTooltip from 'primevue/tooltip';
  import { useReseeUxStore } from '../stores/use-resee-ux-store';
  import Icon from './Icon.vue';
  import IconTextPair from './IconTextPair.vue';

  const props = withDefaults(
    defineProps<TagProps>(),
    {
      text        : undefined,
      icon        : undefined,
      severity    : undefined,
      size        : 'sm',
      tooltip     : undefined,
      chip        : true,
      dismissible : false,
    },
  );

  const emits = defineEmits<TagEmits>();

  const reseeStore = useReseeUxStore();
</script>

<style scoped>
  @reference "tailwindcss";

  @layer components {
    .tag {
      padding     : --spacing(0.5) --spacing(1);
      user-select : all;
      cursor      : default;
    }

    .tag.dismissible {
      display     : inline-flex;
      align-items : center;
      gap         : --spacing(2);
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
