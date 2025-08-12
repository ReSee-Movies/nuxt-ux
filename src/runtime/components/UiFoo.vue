<template>
  <div class="foo bar">
    <slot />

    <PrimeButton label="Click Here" />
  </div>
</template>

<style scoped>
  .foo {
    color: var(--color-slate-500);
  }
</style>
