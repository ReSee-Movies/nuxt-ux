<template>
  <ol v-if="props.toc?.length">
    <li v-for="entry of props.toc" :key="entry.slug">
      <a :href="`#${ entry.slug }`" v-html="entry.text" />
      <TableOfContents v-if="entry.children.length" :toc="entry.children" />
    </li>
  </ol>
</template>


<script lang="ts">
  import type {
    TableOfContents as TableOfContentsOptions,
  } from '@resee-movies/utilities/dom/generate-table-of-contents';

  export type UiTableOfContentsProps = {
    toc: TableOfContentsOptions[] | null | undefined;
  };
</script>


<script setup lang="ts">
  import TableOfContents from './TableOfContents.vue';
  const props = defineProps<UiTableOfContentsProps>();
</script>
