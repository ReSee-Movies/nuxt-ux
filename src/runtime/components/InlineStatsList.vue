<template>
  <div :class="['stats', { responsive: props.responsive }]">
    <dl>
      <slot name="default">
        <template v-if="props.items?.length">
          <InlineStatsListItem
            v-for        = "item of props.items"
            :key         = "item.label"
            :label       = "item.label"
            :description = "item.description"
            :icon        = "item.icon"
          />
        </template>
      </slot>
    </dl>
  </div>
</template>


<script lang="ts">
  import type { InlineStatsListItemProps } from './InlineStatsListItem.vue';

  export interface InlineStatsListProps {
    responsive? : boolean;
    items?      : InlineStatsListItemProps[];
  }
</script>


<script setup lang="ts">
  import InlineStatsListItem from './InlineStatsListItem.vue';

  const props = withDefaults(
    defineProps<InlineStatsListProps>(),
    {
      responsive : false,
      items      : undefined,
    },
  );
</script>


<style scoped>
  @reference "tailwindcss";

  .stats {
    --stats-list-spacer-width: 1.2rem;

    overflow: clip;

    dl {
      display             : flex;
      flex-wrap           : wrap;
      margin-inline-start : calc(var(--stats-list-spacer-width) * -1);
    }

    &.responsive dl {
      @variant max-sm {
        flex-direction: column;
      }
    }
  }
</style>
