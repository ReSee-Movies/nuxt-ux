<template>
  <Component
    :is    = "props.is"
    :class = "[
      'card',
      {
        interactive : props.interactive,
        colorful    : props.colorful,
        bordered    : props.bordered,
        beveled     : props.beveled,
        raised      : props.raised,
      },
    ]"
  >
    <slot name="default">
      <div v-if="slots.image" class="image">
        <slot name="image" />
      </div>

      <div v-if="slots.content" class="content">
        <slot name="content" />
      </div>
    </slot>
  </Component>
</template>


<script lang="ts">
  import type { Component } from 'vue';
  import type { HintedString } from '../types';

  export interface CardProps {
    is?          : HintedString<'div'> | Component;
    interactive? : boolean;
    colorful?    : boolean;
    bordered?    : boolean;
    beveled?     : boolean;
    raised?      : boolean;
  }
</script>


<script setup lang="ts">
  import { useSlots } from '#imports';

  const props = withDefaults(
    defineProps<CardProps>(),
    {
      is          : 'div',
      interactive : false,
      colorful    : false,
      bordered    : false,
      beveled     : false,
      raised      : false,
    },
  );

  const slots = useSlots();
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    @property --resee-card-border-coverage {
      syntax        : "<percentage>";
      inherits      : false;
      initial-value : 0%;
    }

    .card {
      .content {
        padding: --spacing(1.5);
      }

      &.beveled {
        overflow                  : clip;
        border-top-right-radius   : var(--radius-xl);
        border-bottom-left-radius : var(--radius-xl);
      }

      &.raised {
        box-shadow: var(--shadow-heavy);
      }

      --resee-card-bg-color         : var(--color-global-background);
      --resee-card-border-color     : var(--color-global-background-accent);
      --resee-card-border-highlight : var(--color-global-foreground-accent) 0% 100%;
      --resee-card-border-angle     : 225deg;
      --resee-card-border-coverage  : 100%;

      &.bordered:not(.interactive) {
        border: solid 2px var(--resee-card-border-color);
      }

      &.bordered.interactive {
        --resee-card-bg-gradient: linear-gradient(var(--resee-card-bg-color), var(--resee-card-bg-color));

        --resee-card-border-gradient : linear-gradient(225deg,
          var(--resee-card-border-color) 0 var(--resee-card-border-coverage),
          var(--resee-card-border-highlight)
        );

        &.colorful {
          --resee-card-border-highlight: var(--colorscale-resee-linear);

          @variant dark {
            --resee-card-border-highlight: var(--colorscale-resee-lite-linear);
          }
        }

        border            : 2px solid transparent;
        background-origin : border-box;
        background-clip   : padding-box, border-box;
        background-image  : var(--resee-card-bg-gradient), var(--resee-card-border-gradient);
      }

      &.interactive {
        user-select                : none;
        transition-property        : border-radius, box-shadow, --resee-card-border-coverage;
        transition-duration        : 500ms;
        transition-timing-function : var(--default-transition-timing-function);

        &:focus-within, &:hover {
          &.bordered {
            --resee-card-border-coverage: 0%;
          }

          &.beveled {
            border-radius: 0;
          }

          box-shadow: var(--shadow-heavy);
        }
      }
    }
  }
</style>
