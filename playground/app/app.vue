<template>
  <LayoutPageRoot>
    <template #header>
      <NuxtLink to="/" aria-label="Home">
        <ReseeWordLogo />
      </NuxtLink>
    </template>

    <template #default>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>

    <template #footer>
      <NuxtLink to="/" aria-label="Home">
        <ReseeWordLogo size="sm" />
      </NuxtLink>
    </template>
  </LayoutPageRoot>
</template>


<script setup lang="ts">
  import LayoutPageRoot from '#resee-ux/components/LayoutPageRoot.vue';
  import ReseeWordLogo from '#resee-ux/components/ReseeWordLogo.vue';
</script>
