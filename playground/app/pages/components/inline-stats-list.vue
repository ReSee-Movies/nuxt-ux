<template>
  <div class="prose">
    <h2>As Slot Content</h2>
    <UiInlineStatsList responsive>
      <UiInlineStatsListItem label="Planet" description="Earth" icon="i-ph-planet" />
      <UiInlineStatsListItem label="Continent" description="Europe" />
      <UiInlineStatsListItem label="Country" description="United Kingdom" />
      <UiInlineStatsListItem label="City" description="London" />
      <UiInlineStatsListItem label="Borough" description="Suffolk" />
      <UiInlineStatsListItem label="Station" description="Waterloo Station" />
    </UiInlineStatsList>

    <hr>

    <h2>As Array Prop</h2>

    <UiInlineStatsList
      :items="[
        { label: 'Planet', description: 'Earth', icon: 'i-ph-planet' },
        { label: 'Continent', description: 'Europe' },
        { label: 'Country', description: 'Germany' },
        { label: 'City', description: 'Berlin' },
        { label: 'Borough', description: 'Mitte' },
        { label: 'Station', description: 'Hauptbahnhof' },
      ]"
    />
  </div>
</template>


<script setup lang="ts">
  definePageMeta({
    heading: 'Inline Stats List',
  });
</script>
