<template>
  <div class="flex flex-col gap-2 md:flex-row">
    <button
      class="btn"
      @click="notify('This is a general notice. This is a general notice. This is a general notice.', { headline: 'General' })"
    >
      General Notice
    </button>
    <button class="btn" @click="notifyInfo('This is an info notice.', { headline: 'Info', closable: true, lifetime: 0 })">
      Info Notice
    </button>
    <button class="btn" @click="notifyHelp('This is a help notice.')">
      Help Notice
    </button>
    <button class="btn" @click="notifySuccess('This is a success notice.')">
      Success Notice
    </button>
    <button class="btn" @click="notifyWarning('This is a warning notice.')">
      Warning Notice
    </button>
    <button class="btn" @click="notifyError('This is a error notice.')">
      Error Notice
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useNotification } from '#imports';

  definePageMeta({
    heading: 'Notification',
  });

  const {
    notify,
    notifyInfo,
    notifyHelp,
    notifySuccess,
    notifyWarning,
    notifyError,
  } = useNotification();
</script>
