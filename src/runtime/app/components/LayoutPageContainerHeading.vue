<template>
  <div
    v-if   = "showTitleBar"
    :class = "[
      (props.headingLevel === 1 || props.headingLevel === '1' ? 'mb-6' : 'mb-3'),
      props.headerClass,
      {
        'prose-layout-container' : props.prose,
        'sm'                     : props.prose === 'sm',
      },
    ]"
  >
    <div v-if="showHeading || slots.actions" class="flex gap-4 items-center">
      <slot name="heading">
        <Heading
          :text  = "props.headingText"
          :level = "props.headingLevel"
          class  = "grow"
        />
      </slot>

      <div v-if="slots.actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="showSubheading">
      <slot name="subheading">
        <p class="text-global-foreground-accent">
          {{ props.subheadingText }}
        </p>
      </slot>
    </div>
  </div>
</template>


<script lang="ts">
  import type { HTMLElementClassNames } from '../types';
  import type { HeadingProps } from './Heading.vue';

  export interface LayoutPageContainerHeadingProps {
    prose?          : boolean | 'md' | 'sm';
    headingText?    : string;
    headingLevel?   : HeadingProps['level'];
    subheadingText? : string;
    headerClass?    : HTMLElementClassNames;
  }
</script>


<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import Heading from './Heading.vue';

  const props = withDefaults(
    defineProps<LayoutPageContainerHeadingProps>(),
    {
      prose          : false,
      headingText    : undefined,
      headingLevel   : 1,
      subheadingText : undefined,
      headerClass    : undefined,
    },
  );

  const slots = useSlots();

  const showSubheading = computed(
    () => !!(props.subheadingText || slots.subheading),
  );

  const showHeading = computed(
    () => !!(props.headingText || slots.heading),
  );

  const showTitleBar = computed(
    () => showHeading.value || showSubheading.value || !!slots.actions,
  );
</script>
