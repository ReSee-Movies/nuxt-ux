<template>
  <Component
    :is    = "props.is"
    :class = "['page-container', { 'glass-effect': props.glassEffect }]"
  >
    <div
      v-if   = "showTitleBar"
      :class = "[
        'mb-6',
        props.headerClass,
        {
          'prose-layout-container': props.prose,
          'sm': props.prose === 'sm',
        },
      ]"
    >
      <div v-if="showHeading || slots.actions" class="flex gap-4 items-center">
        <slot name="heading">
          <Heading
            :text  = "props.headingText"
            :level = "props.headingLevel"
            class  = "grow"
          />
        </slot>

        <div v-if="slots.actions">
          <slot name="actions" />
        </div>
      </div>

      <div v-if="showSubheading">
        <slot name="subheading">
          <p class="text-global-foreground-accent">{{ props.subheadingText }}</p>
        </slot>
      </div>
    </div>

    <div
      :class="[
        props.contentClass,
        {
          'prose-container': props.prose,
          'sm': props.prose === 'sm',
        },
      ]"
    >
      <slot name="default" />
    </div>
  </Component>
</template>


<script lang="ts">
  import type { HintedString, HTMLElementClassNames } from '../types';
  import type { HeadingProps } from './Heading.vue';

  export interface LayoutPageContainerProps {
    is?             : HintedString<'div' | 'main' | 'section' | 'article' | 'nav'>;
    glassEffect?    : boolean;
    accentColor?    : string;
    prose?          : boolean | 'md' | 'sm';
    headingText?    : string;
    headingLevel?   : HeadingProps['level'];
    subheadingText? : string;
    headerClass?    : HTMLElementClassNames;
    contentClass?   : HTMLElementClassNames;
  }
</script>


<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import Heading from './Heading.vue';

  const slots = useSlots();

  const props = withDefaults(
    defineProps<LayoutPageContainerProps>(),
    {
      is             : 'div',
      glassEffect    : false,
      accentColor    : undefined,
      headingText    : undefined,
      subheadingText : undefined,
      prose          : false,
    },
  );

  const showSubheading = computed(
    () => !!(props.subheadingText || slots.subheading),
  );

  const showHeading = computed(
    () => !!(props.headingText || slots.heading),
  );

  const showTitleBar = computed(
    () => showHeading.value || showSubheading.value || !!slots.actions,
  );
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
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
        background-color : color-mix(in srgb-linear, transparent 20%, var(--color-global-background));
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

      /**
       * Specifically targets a .page-container that is the child of
       * a .page-column which does not have the .layout-vista class,
       * and that is not preceded by another .page-container.
       */
      .page-container:not(.page-container + .page-container):where(.page-column:not(.layout-vista) > .page-container) {
        border-top: none;
      }
    }
  }
</style>
