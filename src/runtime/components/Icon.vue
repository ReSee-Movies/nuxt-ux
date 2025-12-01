<template>
  <Transition
    :name   = "props.transitionName"
    :mode   = "props.transitionMode"
    :appear = "props.transitionOnAppear"
  >
    <ProgressSpinner
      v-if  = "props.loading"
      :size = "props.size"
      class = "icon"
    />

    <span
      v-else
      v-bind = "attrs"
      role   = "presentation"
      :class = "['icon', props.name, props.size, { 'color-cycle': props.colorCycle }]"
    />
  </Transition>
</template>

<script lang="ts">
  export interface IconProps {
    name?               : string;
    loading?            : boolean;
    size?               : 'sm' | 'md' | 'lg' | 'xl';
    colorCycle?         : boolean;
    transitionName?     : string;
    transitionMode?     : 'out-in' | 'in-out';
    transitionOnAppear? : boolean;
  }
</script>

<script setup lang="ts">
  import { useAttrs } from 'vue';
  import ProgressSpinner from './ProgressSpinner.vue';

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const props = withDefaults(
    defineProps<IconProps>(),
    {
      name               : undefined,
      loading            : false,
      size               : 'md',
      colorCycle         : false,
      transitionName     : 'fade',
      transitionMode     : 'out-in',
      transitionOnAppear : false,
    },
  );
</script>

<style scoped>
  .icon {
    display     : inline-flex;
    align-items : center;

    &:before {
      content: var(--zero-width-space);
    }

    &.sm {
      font-size: var(--icon-size-small);
    }

    &.md {
      font-size: var(--icon-size-medium);
    }

    &.lg {
      font-size: var(--icon-size-large);
    }

    &.xl {
      font-size: var(--icon-size-jumbo);
    }

    &.color-cycle {
      --resee-color-cycle-timing: cubic-bezier(0,.5,1,.5);

      animation-name            : resee-color-cycle;
      animation-duration        : 8s;
      animation-iteration-count : infinite;
    }
  }

  @keyframes resee-color-cycle {
    0%     { color: var(--color-resee-red);     animation-timing-function: var(--resee-color-cycle-timing); }
    6.25%  { color: var(--color-resee-orange);  animation-timing-function: var(--resee-color-cycle-timing); }
    18.75% { color: var(--color-resee-yellow);  animation-timing-function: var(--resee-color-cycle-timing); }
    31.25% { color: var(--color-resee-green);   animation-timing-function: var(--resee-color-cycle-timing); }
    43.75% { color: var(--color-resee-seaweed); animation-timing-function: var(--resee-color-cycle-timing); }
    56.25% { color: var(--color-resee-aqua);    animation-timing-function: var(--resee-color-cycle-timing); }
    68.75% { color: var(--color-resee-blue);    animation-timing-function: var(--resee-color-cycle-timing); }
    81.25% { color: var(--color-resee-indigo);  animation-timing-function: var(--resee-color-cycle-timing); }
    93.75% { color: var(--color-resee-violet);  animation-timing-function: var(--resee-color-cycle-timing); }
    100%   { color: var(--color-resee-red);     animation-timing-function: var(--resee-color-cycle-timing); }
  }
</style>
