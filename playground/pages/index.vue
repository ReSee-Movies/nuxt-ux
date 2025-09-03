<template>
  <h1>ReSee Nuxt UX Library</h1>

  <hr class="mb-6">

  <div class="flex flex-col gap-4">
    <NuxtLink :to="{ name: 'components-ui-message' }">Messages</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-loading-indicator' }">Loading Indicator</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-progress-bar' }">Progress Bar</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-tag' }">Tag</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-notification' }">Notifications</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-card' }">Cards</NuxtLink>
  </div>
</template>
