<template>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <UiCard
      :interactive = "showInteractive"
      :colorful    = "showColorful"
      :beveled     = "showBevel"
      :bordered    = "showBorder"
      :raised      = "showRaised"
    >
      <template #content>
        <UiLorem type="sentences" min="5" />
      </template>
    </UiCard>

    <UiCard
      :is          = "NuxtLink"
      to           = "/"
      :interactive = "showInteractive"
      :colorful    = "showColorful"
      :beveled     = "showBevel"
      :bordered    = "showBorder"
      :raised      = "showRaised"
    >
      <template #content>
        <p>As a hyperlink to the homepage.</p>
        <UiLorem type="sentences" min="5" />
      </template>
    </UiCard>
  </div>

  <div class="flex gap-4">
    <Button text="Toggle Bevel" @click="() => { toggleBevel(); }" />
    <Button text="Toggle Border" @click="() => { toggleBorder(); }" />
    <Button text="Toggle Raised" @click="() => { toggleRaised(); }" />
    <Button text="Toggle Interactive" @click="() => { toggleInteractive(); }" />
    <Button text="Toggle Colorful" @click="() => { toggleColorful(); }" />
  </div>
</template>


<script setup lang="ts">
  import { NuxtLink } from '#components';
  import Button from '#resee-ux/components/Button.vue';
  import { useToggle } from '@vueuse/core';

  definePageMeta({
    heading: 'Card',
  });

  const [showBevel, toggleBevel]             = useToggle(true);
  const [showBorder, toggleBorder]           = useToggle(true);
  const [showRaised, toggleRaised]           = useToggle(false);
  const [showInteractive, toggleInteractive] = useToggle(true);
  const [showColorful, toggleColorful]       = useToggle(true);
</script>
