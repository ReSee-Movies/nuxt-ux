<template>
  <HeroBanner :carousel="carouselContent" :autoplay="false">
    <template #actions>
      <Button text="Button One" />
      <Button text="Button Two" />
    </template>
  </HeroBanner>
</template>

<script setup lang="ts">
  import Button from '#resee-ux/components/Button.vue';
  import HeroBanner, { type HeroBannerSingleItemProps } from '#resee-ux/components/HeroBanner.vue';
  import { TmdbBackgrounds, TmdbPosters } from '../../constants';

  definePageMeta({
    layout  : 'basic',
    heading : 'Hero Banner',
  });

  const carouselContent: HeroBannerSingleItemProps[] = [
    ...Array.from({ length: 3 }, (_, idx) => ({
      headlineText : `This is Headline #${ idx + 1 }`,
      subheadText  : `This is the sub-heading #${ idx + 1 }`,
      introText    : `Here is some more content describing what hero banner notice #${ idx + 1 } is all about`,
      backdropSrc  : TmdbBackgrounds.at(idx),
    })),
    {
      headlineText : 'More Than Just<br>a Movie Night.',
      subheadText  : 'Because Movies Are Better <span class="font-bold resee-text-mask resee-bg-linear-to-r">Together</span>.',
      introText    : 'ReSee Movies makes it easy to find cinema experiences worth getting off the couch for.',
      backdropSrc  : TmdbPosters,
    },
  ];
</script>
