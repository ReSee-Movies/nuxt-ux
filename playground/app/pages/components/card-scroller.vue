<template>
  <CardScroller :items="posters">
    <template #item="{ item }">
      <Image
        :src="item"
        aspect="poster"
        bordered
        beveled
        interactive
        colorful
      />
    </template>
  </CardScroller>
</template>


<script setup lang="ts">
  import Image from '#resee-ux/components/Image.vue';
  import CardScroller from '#resee-ux/components/CardScroller.vue';

  definePageMeta({
    heading: 'Card Scroller',
  });

  const posters = [
    '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    '/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
    '/cMYCDADoLKLbB83g4WnJegaZimC.jpg',
    '/p96dm7sCMn4VYAStA6siNz30G1r.jpg',
    '/7uoiKOEjxBBW0AgDGQWrlfGQ90w.jpg',
    '/bSqt9rhDZx1Q7UZ86dBPKdNomp2.jpg',
    '/nhMXB8GTdswYMCL9nepDZymJCOr.jpg',
    '/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
    '/ugmakEL5y294I5bXgiBqApuZpwc.jpg',
    '/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg',
    '/fFVWBMKLwwPh9K0hkrKwPUf8mwn.jpg',
  ];
</script>
