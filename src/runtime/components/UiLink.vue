<template>
  <UiButton
    :is      = "LinkComponent"
    :to      = "props.to"
    :variant = "props.variant"
    :target  = "props.target ?? (props.external ? '_blank' : undefined)"
    :class   = "{ 'no-underline': !props.underline }"
    :spacing = "props.spacing"
  >
    <slot />
  </UiButton>
</template>

<script lang="ts">
  import type { RouteLocationRaw } from 'vue-router';
  import { useNuxtUxConfig } from '../composables/use-nuxt-ux-config';
  import type { UiButtonProps } from './UiButton.vue';

  export type UiLinkProps = {
    to         : RouteLocationRaw;
    external?  : boolean;
    target?    : '_blank' | '_parent' | '_self' | '_top';
    underline? : boolean;
    variant?   : UiButtonProps['variant'];
    spacing?   : UiButtonProps['spacing'];
  } & /* @vue-ignore */ Omit<UiButtonProps, 'bordered' | 'variant' | 'spacing'>;
</script>

<script setup lang="ts">
  const LinkComponent = useNuxtUxConfig().getConfig('UiLinkBaseComponent');

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
