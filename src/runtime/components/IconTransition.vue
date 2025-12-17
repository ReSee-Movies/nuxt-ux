<template>
  <Transition :name="props.transitionName" mode="out-in">
    <Icon
      v-if   = "props.loading || props.name"
      v-bind = "$attrs"
      :name  = "props.name"
      :key   = "props.loading ? 'loading' : props.name"
      :size  = "props.size"
    >
      <template #default v-if="props.loading">
        <ProgressSpinner :size="props.size" />
      </template>
    </Icon>
  </Transition>
</template>


<script lang="ts">
  import type { HintedString } from '../types';
  import type { IconProps } from './Icon.vue';

  export interface IconTransitionProps extends IconProps {
    loading?        : boolean;
    transitionName? : HintedString<'fade' | 'grow-x' | 'grow-y'>;
  }
</script>


<script setup lang="ts">
  import Icon from './Icon.vue';
  import ProgressSpinner from './ProgressSpinner.vue';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<IconTransitionProps>(),
    {
      loading        : false,
      transitionName : 'grow-x',
    },
  );
</script>
