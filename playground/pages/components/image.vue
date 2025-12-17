<template>
  <ClientOnly>
    <div class="flex gap-4 mb-4">
      <Image
        src           = "/rcpMbxYrYLngdyQrt1lK4QkpV06.jpg"
        aspect        = "poster"
        :show-loading = "showLoading"
        :bordered     = "showBorder"
        :beveled      = "showBevel"
        :raised       = "showRaised"
        :glassy       = "showGlassy"
      />

      <Image
        :src          = "``"
        aspect        = "poster"
        :show-loading = "showLoading"
        :bordered     = "showBorder"
        :beveled      = "showBevel"
        :raised       = "showRaised"
        :glassy       = "showGlassy"
      />
    </div>
  </ClientOnly>

  <div class="flex gap-4">
    <Button text="Toggle Bevel" @click="() => { toggleBevel(); }" />
    <Button text="Toggle Border" @click="() => { toggleBorder(); }" />
    <Button text="Toggle Raised" @click="() => { toggleRaised(); }" />
    <Button text="Toggle Glassy" @click="() => { toggleGlassy(); }" />
    <Button text="Toggle Loading" @click="() => { toggleLoading(); }" />
  </div>
</template>


<script setup lang="ts">
  import { useToggle } from '@vueuse/core';
  import Image from '#resee-ux/components/Image.vue';
  import Button from '#resee-ux/components/Button.vue';

  definePageMeta({
    heading: 'Image',
  });

  const [showBevel, toggleBevel]     = useToggle(true);
  const [showBorder, toggleBorder]   = useToggle(true);
  const [showRaised, toggleRaised]   = useToggle(true);
  const [showGlassy, toggleGlassy]   = useToggle(true);
  const [showLoading, toggleLoading] = useToggle(false);
</script>
