<template>
  <ol v-if="props.toc?.length">
    <li v-for="entry of props.toc" :key="entry.slug">
      <NuxtLink
        v-slot  = "config"
        :href   = "`#${ entry.slug }`"
        :custom = "true"
      >
        <a
          v-html = "entry.text"
          :class = "[props.linkClass, { active: mounted && areRoutesStrictEqual(config.route, route) }]"
          :href  = "config.href"
        />
      </NuxtLink>

      <TableOfContents v-if="entry.children?.length" :toc="entry.children" />
    </li>
  </ol>
</template>


<script lang="ts">
  import type {
    TableOfContents as TableOfContentsOptions,
  } from '@resee-movies/utilities/dom/generate-table-of-contents';
  import type { HTMLElementClassNames } from '../types';

  export type TableOfContentsItem = Partial<TableOfContentsOptions> & {
    text : string;
    slug : string;
  };

  export type UiTableOfContentsProps = {
    toc        : TableOfContentsItem[] | null | undefined;
    linkClass? : HTMLElementClassNames;
  };
</script>


<script setup lang="ts">
  import { NuxtLink } from '#components';
  import { useRoute } from '#imports';
  import { onMounted, ref } from 'vue';
  import { areRoutesStrictEqual } from '../utils/routing';
  import TableOfContents from './TableOfContents.vue';

  const props   = defineProps<UiTableOfContentsProps>();
  const route   = useRoute();
  const mounted = ref(false);

  // The `active` class name on links can only be applied client-side because
  // hashes are not send to the server along with the rest of the URL. Not doing
  // this would cause a hydration mismatch.
  onMounted(() => {
    mounted.value = true;
  });
</script>
