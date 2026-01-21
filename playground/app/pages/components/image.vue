<template>
  <div class="flex gap-4 mb-4">
    <Button text="Bevel" @click="() => { toggleBevel(); }" />
    <Button text="Border" @click="() => { toggleBorder(); }" />
    <Button text="Raised" @click="() => { toggleRaised(); }" />
    <Button text="Glassy" @click="() => { toggleGlassy(); }" />
    <Button text="Loading" @click="() => { toggleLoading(); }" />
    <Button text="Interactive" @click="() => { toggleInteractive(); }" />
    <Button text="Colorful" @click="() => { toggleColorful(); }" />
    <Button text="Scale" @click="() => { toggleScale() }" />
  </div>

  <hr class="hr">
  <h2 class="h2">Flexbox</h2>

  <div class="flex gap-4">
    <Image
      :is              = "NuxtLink"
      to               = "/"
      src              = "/rcpMbxYrYLngdyQrt1lK4QkpV0.jpg"
      type             = "tmdb"
      aspect           = "poster"
      :loading         = "showLoading"
      :bordered        = "showBorder"
      :beveled         = "showBevel"
      :raised          = "showRaised"
      :glassy          = "showGlassy"
      :interactive     = "showInteractive"
      :colorful        = "showColorful"
      :scale-to-parent = "showScale"
    />

    <Image
      src              = "/rcpMbxYrYLngdyQrt1lK4QkpV06.jpg"
      type             = "tmdb"
      aspect           = "poster"
      :loading         = "showLoading"
      :bordered        = "showBorder"
      :beveled         = "showBevel"
      :raised          = "showRaised"
      :glassy          = "showGlassy"
      :interactive     = "showInteractive"
      :colorful        = "showColorful"
      :scale-to-parent = "showScale"
    />
  </div>

  <hr class="hr">
  <h2 class="h2">Grid</h2>

  <div class="grid grid-cols-2 gap-4">
    <Image
      :is              = "NuxtLink"
      to               = "/"
      src              = "/rcpMbxYrYLngdyQrt1lK4QkpV06.jpg"
      type             = "tmdb"
      :width           = "showScale ? 'w500' : 'w185'"
      aspect           = "poster"
      :loading         = "showLoading"
      :bordered        = "showBorder"
      :beveled         = "showBevel"
      :raised          = "showRaised"
      :glassy          = "showGlassy"
      :interactive     = "showInteractive"
      :colorful        = "showColorful"
      :scale-to-parent = "showScale"
    />

    <Image
      :is              = "NuxtLink"
      to               = "/"
      src              = "/rcpMbxYrYLngdyQrt1lK4QkpV06.jpg"
      type             = "tmdb"
      :width           = "showScale ? 'w500' : 'w185'"
      aspect           = "poster"
      :loading         = "showLoading"
      :bordered        = "showBorder"
      :beveled         = "showBevel"
      :raised          = "showRaised"
      :glassy          = "showGlassy"
      :interactive     = "showInteractive"
      :colorful        = "showColorful"
      :scale-to-parent = "showScale"
    />
  </div>
</template>


<script setup lang="ts">
  import { useToggle } from '@vueuse/core';
  import { NuxtLink } from '#components';
  import Image from '#resee-ux/components/Image.vue';
  import Button from '#resee-ux/components/Button.vue';

  // /rcpMbxYrYLngdyQrt1lK4QkpV06.jpg
  // /api/simulate/test-image.png?delay=2000

  definePageMeta({
    heading: 'Image',
  });

  const [showBevel, toggleBevel]             = useToggle(true);
  const [showBorder, toggleBorder]           = useToggle(true);
  const [showRaised, toggleRaised]           = useToggle(true);
  const [showGlassy, toggleGlassy]           = useToggle(true);
  const [showLoading, toggleLoading]         = useToggle(false);
  const [showInteractive, toggleInteractive] = useToggle(false);
  const [showColorful, toggleColorful]       = useToggle(false);
  const [showScale, toggleScale]             = useToggle(true);
</script>
