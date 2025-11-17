<template>
  <Button
    :is      = "LinkComponent"
    :to      = "props.to"
    :variant = "props.variant"
    :target  = "props.target ?? (props.external ? '_blank' : undefined)"
    :class   = "{ 'no-underline': !props.underline }"
    :spacing = "props.spacing"
  >
    <slot />
  </Button>
</template>

<script lang="ts">
  import type { RouteLocationRaw } from 'vue-router';
  import { useNuxtUxConfig } from '../composables/use-nuxt-ux-config';
  import type { ButtonProps } from './Button.vue';

  export type UiLinkProps = {
    to         : RouteLocationRaw;
    external?  : boolean;
    target?    : '_blank' | '_parent' | '_self' | '_top';
    underline? : boolean;
    variant?   : ButtonProps['variant'];
    spacing?   : ButtonProps['spacing'];
  } & /* @vue-ignore */ Omit<ButtonProps, 'bordered' | 'variant' | 'spacing'>;
</script>

<script setup lang="ts">
  import { getReseeUxConstant } from '../config';
  import Button from './Button.vue';

  const LinkComponent = getReseeUxConstant('UiLinkBaseComponent');

  const props = withDefaults(
    defineProps<UiLinkProps>(),
    {
      external  : false,
      variant   : 'a',
      target    : undefined,
      underline : true,
      spacing   : 'normal',
    },
  );
</script>
