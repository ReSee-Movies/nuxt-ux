<template>
  <Component
    :is    = "props.is"
    :class = "['page-container', props.glassEffect ? 'glass-effect' : undefined]"
  >
    <slot />
  </Component>
</template>

<script lang="ts">
  import type { HintedString } from '../types';

  export type UiLayoutPageContainerProps = {
    is?          : HintedString<'div' | 'main' | 'section' | 'article' | 'nav'>;
    glassEffect? : boolean;
    accentColor? : string;
  };
</script>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<UiLayoutPageContainerProps>(),
    {
      is          : 'div',
      glassEffect : false,
      accentColor : undefined,
    },
  );
</script>

<style scoped>
  @reference "tailwindcss";

  :global(:root) {
    --page-container-pad-y  : calc(2 * var(--page-column-gutter));
    --page-container-pad-x  : var(--page-container-pad-y);
    --page-container-radius : calc(var(--spacing) * 1);
  }

  .page-container {
    --custom-accent-color         : v-bind(accentColor);
    --page-container-accent-color : var(--custom-accent-color, var(--color-global-foreground-accent));

    border              : solid 1px var(--page-container-accent-color);
    border-radius       : var(--page-container-radius);
    padding             : var(--page-container-pad-y) var(--page-container-pad-x);
    box-shadow          : var(--shadow-heavy);
    background-color    : var(--color-global-background);
    transition          : border-color;
    transition-duration : var(--default-transition-duration);
  }

  @variant sm {
    .page-container.glass-effect {
      backdrop-filter  : blur(var(--blur-sm));
      background-color : color-mix(in srgb-linear, transparent 40%, var(--color-global-background));
    }
  }

  @variant max-sm {
    .page-container:where(.page-column > .page-container) {
      margin-left   : calc(-1 * var(--page-column-gutter));
      margin-right  : calc(-1 * var(--page-column-gutter));
      border-right  : none;
      border-left   : none;
      border-bottom : none;
      border-radius : 0;
      padding-left  : var(--page-column-gutter);
      padding-right : var(--page-column-gutter);
      box-shadow    : none;
    }
  }
</style>
