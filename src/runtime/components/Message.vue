<template>
  <PrimeMessage :severity="props.severity" class="message" :pt="passthroughProps">
    <slot>
      {{ props.text }}
    </slot>
  </PrimeMessage>
</template>

<script lang="ts">
  import { computed } from 'vue';
  import type { StatusLevel } from '../types';

  export interface MessageProps {
    severity? : StatusLevel;
    text?     : string;
    class?    : string;
    style?    : string;
    accented? : boolean;
  }
</script>

<script setup lang="ts">
  import PrimeMessage from 'primevue/message';

  /*
   * Placing the visual design tokens such as the `status-indicating` classname,
   * the `class` prop, and the `style` prop, on the immediate child of the outermost
   * element, instead of on that outermost element itself, is intentional. In browsers
   * that support it, the `grow-y` transition also transition height, and we want to make
   * sure that things like margins are included as part of that calculation.
   */

  const props = defineProps<MessageProps>();

  const passthroughProps = computed(() => {
    return {
      content: {
        class : ['content', `status-indicating${ props.accented ? '-accent' : '' }`, props.severity, props.class],
        style : props.style,
      },

      icon: {
        class: 'icon',
      },

      text: {
        class: 'text',
      },

      closeButton: {
        class: 'close',
      },

      transition: {
        name   : 'grow-y',
        appear : false,
      },
    };
  });
</script>

<style scoped>
  @reference "tailwindcss";

  .message {
    &:deep(.content) {
      display     : flex;
      align-items : center;
      gap         : --spacing(2.5);
      padding     : --spacing(2) --spacing(2.5);
    }

    &:deep(.icon) {
      flex-shrink : 0;
      font-size   : 1.25rem;
    }

    &:deep(.text) {
      flex-grow: 1;
    }

    &:deep(.close) {
      align-self: start;
    }
  }
</style>
