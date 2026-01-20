<template>
  <UiButton
    :text  = "overflowText ? 'Toggle Short Content' : 'Toggle Overflowing Content'"
    @click = "toggleOverflowState"
  />

  <hr class="hr">

  <UiContinueReadingContainer :key="containerKey">
    <div class="prose-container sm">
      <p>
        The <code>ContinueReadingContainer</code> component expands to a
        given maximum height, and presents a "Continue Reading" button if
        its inner content is overflowing.
      </p>

      <UiLorem
        type = "paragraphs"
        :min = "overflowText ? 10 : 1"
        :max = "overflowText ? 10 : 1"
      />
    </div>
  </UiContinueReadingContainer>
</template>


<script setup lang="ts">
  import UiButton from '#resee-ux/components/Button.vue';
  import UiContinueReadingContainer from '#resee-ux/components/ContinueReadingContainer.vue';
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Continue Reading Container',
  });

  const overflowText = ref(false);
  const containerKey = ref(0);

  function toggleOverflowState() {
    overflowText.value = !overflowText.value;
    containerKey.value = containerKey.value + 1;
  }
</script>
