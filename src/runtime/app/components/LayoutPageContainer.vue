<template>
  <Component
    :is    = "props.is"
    :class = "[
      'page-container',
      {
        'glass-effect' : props.glassEffect,
        'relative'     : props.progressOptions,
      },
    ]"
  >
    <div v-if="props.progressOptions" class="progress-wrapper">
      <Transition name="fade">
        <LazyProgressBar
          v-if           = "props.progressOptions.indeterminate || (props.progressOptions.value ?? 0) > 0"
          :indeterminate = "props.progressOptions.indeterminate"
        />
      </Transition>
    </div>

    <LayoutPageContainerHeading
      :prose           = "props.prose"
      :heading-text    = "props.headingText"
      :heading-level   = "props.headingLevel"
      :header-class    = "props.headerClass"
      :subheading-text = "props.subheadingText"
    >
      <template v-if="slots.heading" #heading>
        <slot name="heading" />
      </template>

      <template v-if="slots.subheading" #subheading>
        <slot name="subheading" />
      </template>

      <template v-if="slots.actions" #actions>
        <slot name="actions" />
      </template>
    </LayoutPageContainerHeading>

    <div
      :class="[
        props.contentClass,
        {
          'prose-container' : props.prose,
          'sm'              : props.prose === 'sm',
        },
      ]"
    >
      <slot name="default" />
    </div>
  </Component>
</template>


<script lang="ts">
  import type { HintedString, HTMLElementClassNames } from '../types';
  import type { ProgressBarProps } from './ProgressBar.vue';
  import type { LayoutPageContainerHeadingProps } from './LayoutPageContainerHeading.vue';

  export interface LayoutPageContainerProps extends LayoutPageContainerHeadingProps {
    is?              : HintedString<'div' | 'main' | 'section' | 'article' | 'nav'>;
    glassEffect?     : boolean;
    accentColor?     : string;
    contentClass?    : HTMLElementClassNames;
    progressOptions? : ProgressBarProps;
  }
</script>


<script setup lang="ts">
  import { useSlots } from 'vue';
  import LayoutPageContainerHeading from './LayoutPageContainerHeading.vue';
  import LazyProgressBar from './ProgressBar.vue';

  const props = withDefaults(
    defineProps<LayoutPageContainerProps>(),
    {
      is          : 'div',
      glassEffect : false,
      prose       : false,
    },
  );

  const slots = useSlots();
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

      > .progress-wrapper {
        position     : sticky;
        z-index      : 10;
        top          : var(--page-container-pad-y);
        height       : 0;
        transform    : translateY(calc(-1 * var(--page-container-pad-y)));
        margin-left  : calc(-1 * var(--page-container-pad-x));
        margin-right : calc(-1 * var(--page-container-pad-x));

        &:deep(.progress) {
          border-radius: var(--page-container-radius) var(--page-container-radius) 0 0;
        }
      }
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

        > .progress-wrapper {
          margin-left  : calc(-1 * var(--page-column-gutter));
          margin-right : calc(-1 * var(--page-column-gutter));

          &:deep(.progress) {
            border-radius: 0;
          }
        }
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
