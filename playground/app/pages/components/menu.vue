<template>
  <div class="flex gap-4">
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

    <UiButton text="Open Drawer" @click="showDrawer = true" />
  </div>

  <UiDrawer v-model:visible="showDrawer" position="right" header="Menu Flyout Test">
    <UiMenu :model="menuItems">
      <template #control="{ toggle, menuId, expanded }">
        <UiButton
          text           = "Show Menu"
          :aria-controls = "menuId"
          aria-haspopup  = "true"
          :aria-expanded = "expanded.toString()"
          @click         = "toggle"
        />
      </template>
    </UiMenu>
  </UiDrawer>

  <hr class="hr">

  <UiLorem type="paragraphs" min="10" />
</template>


<script setup lang="ts">
  import UiButton from '#resee-ux/components/Button.vue';
  import UiDrawer from '#resee-ux/components/Drawer.vue';
  import UiMenu, { type MenuItem } from '#resee-ux/components/Menu.vue';
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Menu',
  });

  const showDrawer = ref(false);

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
