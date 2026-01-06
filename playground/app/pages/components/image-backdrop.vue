<template>
  <UiImageBackdrop
    :src         = "singleImage ? AvatarBackground : TmdbPosters"
    :mask-preset = "['image-mask-gradient-washout-lite', 'image-mask-gradient-opacity']"
  >
    <UiLayoutPageColumn layout="vista">
      <UiLayoutPageContainer heading-text="Image Backdrop" :glass-effect="true">
        <UiButton text="Toggle Background" @click="singleImage = !singleImage" />
      </UiLayoutPageContainer>
    </UiLayoutPageColumn>
  </UiImageBackdrop>
</template>


<script setup lang="ts">
  import UiButton from '#resee-ux/components/Button.vue';
  import UiImageBackdrop from '#resee-ux/components/ImageBackdrop.vue';
  import UiLayoutPageColumn from '#resee-ux/components/LayoutPageColumn.vue';
  import UiLayoutPageContainer from '#resee-ux/components/LayoutPageContainer.vue';
  import { ref } from 'vue';
  import { TmdbPosters } from '../../constants';

  definePageMeta({
    heading : 'Image Backdrop',
    layout  : 'basic',
  });

  const singleImage = ref(true);

  const AvatarBackground = '/u4WxJSTx4P0aQdOZNNZGRt2DO73.jpg';
</script>
