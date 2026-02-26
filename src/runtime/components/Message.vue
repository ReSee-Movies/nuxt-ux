<template>
  <PrimeMessage
    class     = "message"
    :severity = "props.severity"
    :pt       = "passthroughProps"
  >
    <template v-if="displayIcon" #icon>
      <Icon :name="displayIcon" :size="props.iconSize" />
    </template>

    <template #default>
      <slot>{{ props.text }}</slot>
    </template>
  </PrimeMessage>
</template>

<script lang="ts">
  import type { HTMLElementClassNames, StyleStatusLevel } from '../types';
  import type { IconProps } from './Icon.vue';

  export interface MessageProps {
    severity?       : StyleStatusLevel;
    text?           : string;
    class?          : HTMLElementClassNames;
    style?          : string;
    accented?       : boolean;
    icon?           : IconProps['name'] | false;
    iconSize?       : IconProps['size'];
    scrollIntoView? : boolean;
  }
</script>

<script setup lang="ts">
  import { useCurrentElement } from '@vueuse/core';
  import PrimeMessage from 'primevue/message';
  import { computed, onMounted } from 'vue';
  import Icon from './Icon.vue';
  import { StatusLevelIcons } from '../constants';

  /*
   * Placing the visual design tokens such as the `status-indicating` classname,
   * the `class` prop, and the `style` prop, on the immediate child of the outermost
   * element, instead of on that outermost element itself, is intentional. In browsers
   * that support it, the `grow-y` transition also transition height, and we want to make
   * sure that things like margins are included as part of that calculation.
   */

  const props = withDefaults(
    defineProps<MessageProps>(),
    {
      severity       : 'default',
      text           : undefined,
      class          : undefined,
      style          : undefined,
      accented       : false,
      icon           : undefined,
      iconSize       : undefined,
      scrollIntoView : false,
    },
  );

  const element = useCurrentElement();

  onMounted(() => {
    if (props.scrollIntoView && element.value instanceof HTMLElement) {
      element.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

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

  const displayIcon = computed(() => {
    if (props.icon === false) {
      return undefined;
    }

    return props.icon ?? StatusLevelIcons[props.severity];
  });
</script>

<style scoped>
  @reference "tailwindcss";

  @layer components {
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
  }
</style>
