<template>
  <div class="motion-art">
    <div class="spotlight spotlight-1"><div /></div>
    <div class="spotlight spotlight-2"><div /></div>
    <div class="spotlight spotlight-3"><div /></div>
  </div>
</template>


<script lang="ts">
  export interface MotionArtProps {
    primaryColor?   : string;
    secondaryColor? : string;
    tertiaryColor?  : string;
  }
</script>

<script setup lang="ts">
  withDefaults(
    defineProps<MotionArtProps>(),
    {
      primaryColor   : 'var(--color-resee-indigo)',
      secondaryColor : 'initial',
      tertiaryColor  : 'initial',
    },
  );
</script>


<style scoped>
  @reference "tailwindcss";

  .motion-art {
    --motion-art-color-1       : v-bind(primaryColor);
    --motion-art-color-2-bound : v-bind(secondaryColor);
    --motion-art-color-2       : var(--motion-art-color-2-bound, oklch(from var(--motion-art-color-1) l c calc(h + 135)));
    --motion-art-color-3-bound : v-bind(tertiaryColor);
    --motion-art-color-3       : var(--motion-art-color-3-bound, oklch(from var(--motion-art-color-1) l c calc(h + 270)));

    container-type: size;
  }

  .spotlight {
    position        : absolute;
    filter          : blur(3px);
    animation       : x var(--speed) linear infinite var(--direction);
    animation-delay : var(--delay-x);

    > div {
      width         : var(--size);
      height        : var(--size);
      border-radius : 100%;
      background    : var(--color);
      opacity       : 0.5;

      animation:
        y calc(0.7 * var(--speed)) linear infinite var(--direction),
        c var(--speed) linear infinite var(--direction);

      animation-delay: var(--delay-y);
    }
  }

  @variant motion-reduce {
    .spotlight {
      animation-play-state: paused;

      > div {
        animation-play-state: paused;
      }
    }
  }

  @keyframes x {
    100% {
      transform : translateX(calc(100cqw - var(--size)));
      filter    : blur(10px);
    }
  }

  @keyframes y {
    100% {
      transform : translateY(calc(100cqh - var(--size)));
      opacity   : 0.3;
    }
  }

  @keyframes c {
    33%  { background: var(--color-2); }
    66%  { background: var(--color-3); }
    100% { background: var(--color); }
  }

  .spotlight-1 {
    --size      : 20vw;
    --speed     : 50s;
    --direction : alternate;
    --color     : var(--motion-art-color-1);
    --color-2   : var(--motion-art-color-2);
    --color-3   : var(--motion-art-color-3);
    --delay-x   : -7s;
    --delay-y   : -8s;
  }

  .spotlight-2 {
    --size      : 10vw;
    --speed     : 40s;
    --direction : alternate;
    --color     : var(--motion-art-color-2);
    --color-2   : var(--motion-art-color-1);
    --color-3   : var(--motion-art-color-3);
    --delay-x   : -30s;
    --delay-y   : -1s;
  }

  .spotlight-3 {
    --size      : 30vw;
    --speed     : 60s;
    --direction : alternate-reverse;
    --color     : var(--motion-art-color-3);
    --color-2   : var(--motion-art-color-1);
    --color-3   : var(--motion-art-color-2);
    --delay-x   : -13s;
    --delay-y   : 0;
  }
</style>
