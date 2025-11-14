<template>
  <Component
    :is    = "props.is"
    :class = "['page-column', props.layout ? `layout-${ props.layout }` : undefined]"
  >
    <slot />
  </Component>
</template>

<script lang="ts">
  export type LayoutPageColumn = {
    is?     : string;
    layout? : 'main' | 'vista';
  };
</script>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<LayoutPageColumn>(),
    {
      is     : 'div',
      layout : undefined,
    },
  );
</script>

<style scoped>
  @reference "tailwindcss";

  :global(:root) {
    --page-column-gutter    : calc(var(--spacing) * 3);  /* 0.75rem */
    --page-column-pad-y     : calc(var(--spacing) * 12); /* 3rem */
    --page-column-pad-vista : calc(var(--spacing) * 52); /* 13rem */
  }

  .page-column {
    margin-left  : auto;
    margin-right : auto;
    padding      : var(--page-column-gutter);

    &.layout-main:where(:has(:first-child.page-container)) {
      padding-top    : 0;
      padding-bottom : 0;
    }

    &.layout-vista:where(:has(:last-child.page-container)) {
      padding-bottom: 0;
    }
  }

  @variant md {
    .page-column {
      max-width: var(--container-3xl);

      &.layout-main {
        padding-top    : var(--page-column-pad-y);
        padding-bottom : var(--page-column-pad-y);
      }

      &.layout-vista {
        padding-bottom: var(--page-column-pad-y);
      }
    }
  }

  @variant lg {
    .page-column {
      max-width: var(--container-5xl);

      &.layout-vista {
        padding-top: var(--page-column-pad-vista);
      }
    }
  }

  @variant portrait {
    /*
     * The lesser of either 13rem, or 110px smaller than the height of a 16/9 "box"
     * using the viewport to provide the width.
     */
    .page-column.layout-vista {
      padding-top: min(calc(var(--spacing) * 52), calc(calc(100vw * 0.5625) - 110px));
    }
  }
</style>
