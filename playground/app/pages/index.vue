<template>
  <div class="sm:columns-2 *:block *:mb-4 sm:*:mb-2">
    <NuxtLink
      v-for = "page of pages"
      :key  = "page.route"
      :to   = "{ name: page.route }"
      class = "a text-lg sm:text-base"
    >
      <IconTextPair :text="page.label" :icon="page.icon" />
    </NuxtLink>
  </div>
</template>


<script setup lang="ts">
  import IconTextPair from '#resee-ux/components/IconTextPair.vue';

  definePageMeta({
    heading: 'ReSee UX Component Library',
  });

  const pages = [
    { label: 'Layout',            icon: 'i-ph-ruler',                route: 'layout' },
    { label: 'Typography',        icon: 'i-ph-text-aa',              route: 'typography' },
    { label: 'Button',            icon: 'i-ph-radio-button',         route: 'components-button' },
    { label: 'Card',              icon: 'i-ph-bounding-box',         route: 'components-card' },
    { label: 'Card Scroller',     icon: 'i-ph-hand-swipe-right',     route: 'components-card-scroller' },
    { label: 'Dialog',            icon: 'i-ph-box-arrow-up',         route: 'components-dialog' },
    { label: 'Drawer',            icon: 'i-ph-arrow-line-left',      route: 'components-drawer' },
    { label: 'Form',              icon: 'i-ph-textbox',              route: 'components-form' },
    { label: 'Icon',              icon: 'i-ph-mask-happy',           route: 'components-icon' },
    { label: 'Image',             icon: 'i-ph-image',                route: 'components-image' },
    { label: 'Image Backdrop',    icon: 'i-ph-selection-background', route: 'components-image-backdrop'},
    { label: 'Image Tiler',       icon: 'i-ph-grid-four',            route: 'components-image-tiler' },
    { label: 'Inline Stats List', icon: 'i-ph-dots-three-outline',   route: 'components-inline-stats-list' },
    { label: 'Menu',              icon: 'i-ph-list',                 route: 'components-menu' },
    { label: 'Message',           icon: 'i-ph-chat-centered-text',   route: 'components-message' },
    { label: 'Notification',      icon: 'i-ph-notification',         route: 'components-notification' },
    { label: 'Progress Bar',      icon: 'i-ph-battery-medium-fill',  route: 'components-progress-bar' },
    { label: 'Progress Spinner',  icon: 'i-ph-arrows-clockwise',     route: 'components-progress-spinner' },
    { label: 'Table of Contents', icon: 'i-ph-list-numbers',         route: 'components-table-of-contents' },
    { label: 'Tag',               icon: 'i-ph-tag',                  route: 'components-tag' },
  ];
</script>
