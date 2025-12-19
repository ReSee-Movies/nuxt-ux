<template>
  <div>
    <NuxtLoadingIndicator :color="false" class="resee-bg-linear-to-r" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <LazyNotificationContainer />
  </div>
</template>


<script setup lang="ts">
  import LazyNotificationContainer from '#resee-ux/components/NotificationContainer.vue';
</script>
