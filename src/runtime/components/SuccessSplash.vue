<template>
  <div>
    <svg
      xmlns   = "http://www.w3.org/2000/svg"
      viewBox = "0 0 214 214"
    >
      <g fill="none" stroke="currentColor" stroke-width="2">
        <circle
          fill    = "currentColor"
          opacity = "0.15"
          cx      = "107"
          cy      = "107"
          r       = "72"
        />

        <circle
          fill    = "currentColor"
          cx      = "107"
          cy      = "107"
          r       = "72"
          opacity = "0.8"
        />

        <polyline
          stroke       = "#fff"
          stroke-width = "10"
          points       = "73.5,107.8 93.7,127.9 142.2,79.4"
          style        = "stroke-dasharray: 50%, 50%; stroke-dashoffset: 100%"
        />
      </g>
    </svg>

    <p v-if="props.text">
      {{ props.text }}
    </p>
  </div>
</template>


<script setup lang="ts">
  const props = defineProps<{
    text?: string;
  }>();
</script>


<style scoped>
  @reference "tailwindcss";

  @keyframes checkmark {
      0% { stroke-dashoffset: 50%; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes grow-circle {
    0% { r: 0; }
  }

  @keyframes grow-circle-bigger {
     50% { opacity: 0.11; }
    100% { r: 100; opacity: 0; }
  }

  @keyframes show-text {
    100% { opacity: 1 }
  }

  div {
    display        : flex;
    flex-direction : column;
    align-items    : center;
  }

  svg {
    color     : var(--color-success);
    max-width : --spacing(48);
    margin    : --spacing(-4);

    polyline {
      animation: checkmark 0.5s cubic-bezier(0.55, 0.2, 0.71, -0.04) 0.7s backwards;
    }

    circle:nth-child(1) {
      animation:
        grow-circle 0.45s cubic-bezier(0.66, 0.23, 0.51, 1.23) backwards,
        grow-circle-bigger 0.9s linear 1.1s forwards;
    }

    circle:nth-child(2) {
      animation: grow-circle 0.5s cubic-bezier(0.66, 0.23, 0.51, 1.23) 0.25s backwards;
    }
  }

  p {
    opacity    : 0;
    animation  : show-text 0.5s linear 0.9s forwards;
    font-size  : var(--text-lg);
    text-align : center;
  }
</style>
