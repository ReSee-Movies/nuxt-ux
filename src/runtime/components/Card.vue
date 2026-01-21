<template>
  <Component
    :is    = "props.is"
    :class = "[
      'card',
      {
        loading     : props.loading,
        interactive : props.interactive,
        colorful    : props.colorful,
        bordered    : props.bordered,
        beveled     : props.beveled,
        raised      : props.raised,
      },
    ]"
  >
    <slot />
  </Component>
</template>


<script lang="ts">
  import type { Component } from 'vue';
  import type { HintedString } from '../types';

  export interface CardProps {
    is?          : HintedString<'div'> | Component;
    loading?     : boolean;
    interactive? : boolean;
    colorful?    : boolean;
    bordered?    : boolean;
    beveled?     : boolean;
    raised?      : boolean;
  }
</script>


<script setup lang="ts">
  const props = withDefaults(
    defineProps<CardProps>(),
    {
      is          : 'div',
      loading     : false,
      interactive : false,
      colorful    : false,
      bordered    : false,
      beveled     : false,
      raised      : false,
    },
  );
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    @property --resee-card-border-coverage {
      syntax        : "<percentage>";
      inherits      : false;
      initial-value : 0%;
    }

    @property --resee-card-bg-color {
      syntax        : "<color>";
      inherits      : false;
      initial-value : transparent;
    }

    @keyframes resee-card-bg-color-pulse {
        0% { background-color: var(--resee-card-bg-load-color-1); }
       50% { background-color: var(--resee-card-bg-load-color-2); }
      100% { background-color: var(--resee-card-bg-load-color-1); }
    }


    .card {
      --resee-card-bg-color         : var(--color-global-background);
      --resee-card-bg-load-color-1  : rgb(255, 255, 255);
      --resee-card-bg-load-color-2  : rgb(240, 240, 240);
      --resee-card-border-color     : var(--color-global-background-accent);
      --resee-card-border-highlight : var(--color-global-foreground-accent) 0% 100%;
      --resee-card-border-angle     : 225deg;
      --resee-card-border-coverage  : 100%;
      --resee-card-border-weight    : 2px;

      @variant dark {
        --resee-card-bg-load-color-1 : rgb(0, 0, 0);
        --resee-card-bg-load-color-2 : rgb(15, 15, 15);
      }

      background-color: var(--resee-card-bg-color);
    }


    .card.loading {
      animation-name            : resee-card-bg-color-pulse;
      animation-duration        : 2.5s;
      animation-timing-function : ease-out;
      animation-fill-mode       : both;
      animation-iteration-count : infinite;
    }


    .card.beveled {
      overflow                  : clip;
      border-top-right-radius   : var(--radius-xl);
      border-bottom-left-radius : var(--radius-xl);
    }


    .card.raised {
      box-shadow: var(--shadow-heavy);
    }


    .card.bordered:not(.interactive),
    .card.bordered.loading {
      border: solid var(--resee-card-border-weight) var(--resee-card-border-color);
    }


    .card.bordered.interactive:not(.loading) {
      --resee-card-bg-gradient: linear-gradient(
        var(--resee-card-bg-color),
        var(--resee-card-bg-color)
      );

      --resee-card-border-gradient : linear-gradient(225deg,
        var(--resee-card-border-color) 0 var(--resee-card-border-coverage),
        var(--resee-card-border-highlight)
      );

      border            : var(--resee-card-border-weight) solid transparent;
      background-origin : border-box;
      background-clip   : padding-box, border-box;
      background-image  : var(--resee-card-bg-gradient), var(--resee-card-border-gradient);

      &.colorful {
        --resee-card-border-highlight: var(--colorscale-resee-linear);

        @variant dark {
          --resee-card-border-highlight: var(--colorscale-resee-lite-linear);
        }
      }
    }


    .card.interactive:not(.loading) {
      user-select                : none;
      transition-property        : border-radius, box-shadow, --resee-card-border-coverage;
      transition-duration        : calc(var(--default-transition-duration) * 3);
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
</style>
