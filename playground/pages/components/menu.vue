<template>
  <h1 class="h1">Menu</h1>

  <UiMenu :model="menuItems" prefix-text="Some Prefix Text" suffix-text="Some Suffix Text">
    <template #control="{ toggle, menuId, expanded }">
      <UiButton
        text           = "Show"
        :aria-controls = "menuId"
        aria-haspopup  = "true"
        :aria-expanded = "expanded.toString()"
        @click         = "toggle"
      />
    </template>
  </UiMenu>
</template>


<script setup lang="ts">
  import type { MenuItem } from '#resee-ux/components/Menu.vue';

  const menuItems: MenuItem[] = [
    { label: 'Item 1', icon: 'i-ph-x' },
    { label: 'Item 2' },
    { label: 'Item 3' },
    { separator: true },
    { label: 'Item 4', disabled: true },
    { label: 'Item 5 with a really, really long label that you think should wrap around, right? RIGHT!?' },

    {
      label: 'Documents',
      items: [
        { label: 'Foo' },
        { label: 'Bar' },
        { label: 'Baz' },
        { label: 'Google', url: 'https://www.google.com', target: '_blank' },
      ],
    },
  ];
</script>
