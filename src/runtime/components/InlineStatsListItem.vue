<template>
  <dt class="sr-only">
    <slot name="label">
      {{ props.label }}
    </slot>
  </dt>

  <dd>
    <slot name="default">
      <IconTextPair :icon="props.icon" :text="props.description">
        <template #default v-if="slots.description">
          <slot name="description" />
        </template>
      </IconTextPair>
    </slot>
  </dd>
</template>


<script lang="ts">
  export interface InlineStatsListItemProps {
    label        : string;
    description? : string;
    icon?        : string;
  }
</script>


<script setup lang="ts">
  import IconTextPair from './IconTextPair.vue';
  import { useSlots } from 'vue';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<InlineStatsListItemProps>(),
    {
      icon: undefined,
    },
  );

  const slots = useSlots();
</script>


<style scoped>
  @reference "tailwindcss";

  dd {
    position             : relative;
    padding-inline-start : var(--stats-list-spacer-width);

    &:before {
      position           : absolute;
      inset-inline-start : 0;
      margin-inline      : --spacing(2);
      color              : var(--color-global-foreground-accent);
      content            : "|";
    }
  }
</style>
