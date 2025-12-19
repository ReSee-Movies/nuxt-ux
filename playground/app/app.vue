<template>
  <div>
    <NuxtLoadingIndicator :color="false" class="resee-bg-linear-to-r" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <NotificationContainer />
  </div>
</template>


<script setup lang="ts">
  import NotificationContainer from '#resee-ux/components/NotificationContainer.vue';
</script>
