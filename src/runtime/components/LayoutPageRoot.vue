<template>
  <div class="app-main">
    <ClientOnly>
      <LazyNuxtRouteAnnouncer />
      <LazyNuxtLoadingIndicator :color="false" class="resee-bg-linear-to-r" />
    </ClientOnly>

    <GlobalHeaderAnnouncement v-if="slots.announcement" :announcement-id="props.announcementId">
      <slot name="announcement" />
    </GlobalHeaderAnnouncement>

    <GlobalHeader v-if="slots.header || slots.subheader" class="app-header">
      <template #default v-if="slots.header">
        <slot name="header" />
      </template>

      <template #subheader v-if="slots.subheader">
        <slot name="subheader" />
      </template>
    </GlobalHeader>

    <slot name="default" />

    <footer v-if="slots.footer" class="app-footer">
      <LayoutPageColumn>
        <slot name="footer" />
      </LayoutPageColumn>
    </footer>

    <ClientOnly>
      <LazyNotificationContainer />
    </ClientOnly>
  </div>
</template>


<script lang="ts">
  export interface LayoutPageRootProps {
    announcementId?: string;
  }
</script>


<script setup lang="ts">
  import { LazyNuxtLoadingIndicator, LazyNuxtRouteAnnouncer } from '#components';
  import { useSlots } from 'vue';
  import GlobalHeaderAnnouncement from './GlobalHeaderAnnouncement.vue';
  import LayoutPageColumn from './LayoutPageColumn.vue';
  import LazyNotificationContainer from './NotificationContainer.vue';
  import GlobalHeader from './GlobalHeader.vue';

  const props = withDefaults(
    defineProps<LayoutPageRootProps>(),
    {
      announcementId: undefined,
    },
  );

  const slots = useSlots();
</script>


<style>
  @reference "tailwindcss";

  .app-header, .app-footer {
    background-color : --alpha(var(--color-global-background) / 60%);
    backdrop-filter  : blur(var(--blur-md));
  }

  .app-header {
     border-bottom: solid 1px var(--color-global-foreground-accent);
  }

  .app-footer {
    border-top: solid 1px var(--color-global-foreground-accent);
  }
</style>
