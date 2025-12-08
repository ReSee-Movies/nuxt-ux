<template>
  <div
    :id    = "widgetId"
    :class = "[
      'w-fit',
      (props.size === 'compact' ? 'h-[140px]' : 'h-[65px]'),
    ]"
  />
</template>


<script lang="ts">
  import type { TurnstileRenderOptions } from '../../../composables/use-cloudflare-turnstile';
  export interface FormFieldTurnstileProps extends TurnstileRenderOptions {}
</script>


<script setup lang="ts">
  import { onUnmounted, useId } from '#imports';
  import { useCloudflareTurnstile, type Turnstile } from '../../../composables/use-cloudflare-turnstile';

  const props = withDefaults(
    defineProps<FormFieldTurnstileProps>(),
    {
      'size'            : 'flexible',
      'retry'           : 'auto',
      'retry-interval'  : 8000,
      'refresh-expired' : 'auto',
      'refresh-timeout' : 'auto',
      'appearance'      : 'always',
      'execution'       : 'render',
      'theme'           : 'auto',
    },
  );

  const widgetId = useId();
  const { onReady } = useCloudflareTurnstile();

  let turnstile: Turnstile | undefined = undefined;

  onReady((ts) => {
    ts.render(`#${ widgetId }`, { ...props });
    turnstile = ts;
  });

  onUnmounted(() => {
    turnstile?.remove(`#${ widgetId }`);
  });
</script>
