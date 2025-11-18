<template>
  <div class="prose">
    <h1>ReSee Nuxt UX Library</h1>
    <hr>
  </div>

  <div class="flex flex-col gap-4">
    <NuxtLink :to="{ name: 'typography' }" icon="i-ph-text-aa">Typography</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-message' }" icon="i-ph-chat">Messages</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-progress-spinner' }" icon="i-ph-gauge">Progress Spinner</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-progress-bar' }">Progress Bar</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-tag' }">Tag</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-notification' }">Notifications</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-card' }" icon="i-ph-bounding-box">Cards</NuxtLink>
    <NuxtLink :to="{ name: 'components-ui-button' }">Buttons</NuxtLink>
  </div>
</template>
