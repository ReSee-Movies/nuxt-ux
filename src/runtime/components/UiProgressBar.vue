<template>
  <PrimeProgressBar
    :value      = "props.value ?? 0"
    :show-value = "props.showValue"
    :mode       = "mode"
    :class      = "['progress', mode]"
    :pt         = "{ value: { class: 'value' } }"
  />
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      value?         : number | undefined;
      showValue?     : boolean;
      indeterminate? : boolean;
    }>(),
    {
      value         : undefined,
      showValue     : false,
      indeterminate : false,
    },
  );

  const mode = computed(() => {
    return props.indeterminate || typeof props.value !== 'number'
      ? 'indeterminate'
      : 'determinate';
  });
</script>

<style scoped>
  @reference "tailwindcss";

  .progress {
    height        : --spacing(1.5);
    background    : var(--color-global-background-accent);
    border-radius : var(--radius-full);
    box-shadow    : var(--inset-shadow-sm);
    overflow      : clip;
  }

  .progress.determinate:deep(.value) {
    height                     : --spacing(1.5);
    background                 : var(--custom-accent-color, var(--color-global-foreground));
    border-radius              : var(--radius-full);
    transition                 : width;
    transition-duration        : var(--default-transition-duration);
    transition-timing-function : var(--default-transition-timing-function);
  }

  .progress.indeterminate:deep(.value) {
    position: relative;

    &::before,
    &::after {
      position           : absolute;
      content            : "";
      will-change        : auto;
      inset-inline-start : 0;
      inset-inline-end   : 0;
      height             : --spacing(1.5);
      background         : var(--custom-accent-color, var(--color-global-foreground));
      border-radius      : var(--radius-full);
    }

    &::before {
      animation: indeterminate-before 2.1s infinite cubic-bezier(0.65, 0.815, 0.735, 0.395);
    }

    &::after {
      animation       : indeterminate-after 2.1s infinite cubic-bezier(0.165, 0.84, 0.44, 1);
      animation-delay : 1.15s;
    }
  }

  @keyframes indeterminate-before {
      0% { inset-inline-start: -35%; inset-inline-end: 100%; }
     60% { inset-inline-start: 100%; inset-inline-end: -90%; }
    100% { inset-inline-start: 100%; inset-inline-end: -90%; }
  }

  @keyframes indeterminate-after {
      0% { inset-inline-start: -200%; inset-inline-end: 100%; }
     60% { inset-inline-start: 107%;  inset-inline-end: -8%; }
    100% { inset-inline-start: 107%;  inset-inline-end: -8%; }
  }
</style>
