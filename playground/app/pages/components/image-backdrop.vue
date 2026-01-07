<template>
  <UiImageBackdrop
    :src         = "backgroundSrc"
    :mask-preset = "[]"
  >
    <template #default>
      <UiLayoutPageColumn layout="vista">
        <UiLayoutPageContainer
          heading-text  = "Image Backdrop"
          :glass-effect = "true"
        >
          <p class="p mb-6">Currently Showing: {{ backgroundName }}</p>

          <UiButton
            text   = "Cycle Background Type"
            @click = "cycleBackgroundSource()"
          />
        </UiLayoutPageContainer>
      </UiLayoutPageColumn>
    </template>
  </UiImageBackdrop>
</template>


<script setup lang="ts">
  import UiButton from '#resee-ux/components/Button.vue';
  import UiImageBackdrop from '#resee-ux/components/ImageBackdrop.vue';
  import UiLayoutPageColumn from '#resee-ux/components/LayoutPageColumn.vue';
  import UiLayoutPageContainer from '#resee-ux/components/LayoutPageContainer.vue';
  import { getRandomEntry } from '@resee-movies/utilities/arrays/get-random-entry';
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import { ref } from 'vue';
  import { TmdbBackgrounds, TmdbPosters } from '../../constants';

  definePageMeta({
    heading : 'Image Backdrop',
    layout  : 'basic',
  });

  const backgroundName = ref<string>();
  const backgroundSrc  = ref<string | string[]>();


  function cycleBackgroundSource() {
    if (isString(backgroundSrc.value)) {
      backgroundSrc.value  = TmdbPosters;
      backgroundName.value = 'Image Tiler';
    }
    else if (Array.isArray(backgroundSrc.value)) {
      backgroundSrc.value  = undefined;
      backgroundName.value = 'Motion Art';
    }
    else {
      backgroundSrc.value  = getRandomEntry(TmdbBackgrounds);
      backgroundName.value = 'Single Image';
    }
  }

  cycleBackgroundSource();
</script>
