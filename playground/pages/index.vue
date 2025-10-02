<template>
  <div class="prose">
    <h1>ReSee Nuxt UX Library</h1>
    <hr>
  </div>

  <div class="flex flex-col gap-4">
    <UiLink :to="{ name: 'typography' }" icon="i-ph-text-aa">Typography</UiLink>
    <UiLink :to="{ name: 'components-ui-message' }" icon="i-ph-chat">Messages</UiLink>
    <UiLink :to="{ name: 'components-ui-loading-indicator' }" icon="i-ph-gauge">Loading Indicator</UiLink>
    <UiLink :to="{ name: 'components-ui-progress-bar' }">Progress Bar</UiLink>
    <UiLink :to="{ name: 'components-ui-tag' }">Tag</UiLink>
    <UiLink :to="{ name: 'components-ui-notification' }">Notifications</UiLink>
    <UiLink :to="{ name: 'components-ui-card' }" icon="i-ph-bounding-box">Cards</UiLink>
    <UiLink :to="{ name: 'components-ui-button' }">Buttons</UiLink>
  </div>
</template>
