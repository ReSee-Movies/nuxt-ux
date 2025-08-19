<template>
  <h1>&ltUiNotification /&gt;</h1>

  <button
    @click="notify('This is a general notice. This is a general notice. This is a general notice.', { headline: 'General' })"
  >
    General Notice
  </button>
  <button @click="notifyInfo('This is an info notice.', { headline: 'Info' })">Info Notice</button>
  <button @click="notifyHelp('This is a help notice.')">Help Notice</button>
  <button @click="notifySuccess('This is a success notice.')">Success Notice</button>
  <button @click="notifyWarning('This is a warning notice.')">Warning Notice</button>
  <button @click="notifyError('This is a error notice.')">Error Notice</button>

  <LazyUiNotificationContainer />
</template>

<script setup lang="ts">
  import { useNotification } from '#imports';

  const {
    notify,
    notifyInfo,
    notifyHelp,
    notifySuccess,
    notifyWarning,
    notifyError,
  } = useNotification();
</script>
