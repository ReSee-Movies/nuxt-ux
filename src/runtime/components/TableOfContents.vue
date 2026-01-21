<template>
  <ol v-if="props.toc?.length">
    <template v-for="entry of props.toc" :key="entry.slug">
      <li v-if="shouldRenderLevel(entry.level)">
        <NuxtLink
          :href  = "`#${ entry.slug }`"
          :class = "[props.linkClass, { active: doesRouteHaveHash(route, entry.slug) }]"
        >
          <span v-html="entry.text" />
        </NuxtLink>

        <TableOfContents
          v-if        = "entry.children?.length && shouldRenderLevel((entry.level ?? 1) + 1)"
          :toc        = "entry.children"
          :link-class = "props.linkClass"
          :min-depth  = "props.minDepth"
          :max-depth  = "props.maxDepth"
        />
      </li>
    </template>
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
    minDepth?  : number;
    maxDepth?  : number;
    linkClass? : HTMLElementClassNames;
  };
</script>


<script setup lang="ts">
  import { NuxtLink } from '#components';
  import { useRoute } from '#imports';
  import { onMounted, ref } from 'vue';
  import type { RouteLocationGeneric } from 'vue-router';
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


  function shouldRenderLevel(level: number | undefined) {
    if (!level) {
      return true;
    }

    return (!props.minDepth || props.minDepth <= level) && (!props.maxDepth || props.maxDepth >= level);
  }


  function doesRouteHaveHash(route: RouteLocationGeneric, hash: string | null | undefined) {
    return hash && route.hash === `#${ hash }`;
  }
</script>
