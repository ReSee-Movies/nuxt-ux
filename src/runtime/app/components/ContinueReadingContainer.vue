<template>
  <div class="continue-reading">
    <div
      :class = "{
        'show-all'                    : showAllContent,
        'image-mask-gradient-opacity' : isOverflowing && !showAllContent,
      }"
    >
      <div ref="innerContainer">
        <slot />
      </div>
    </div>

    <div v-if="isOverflowing && !showAllContent">
      <Button
        :text  = "reseeUx.locale.continueReading"
        size   = "sm"
        @click = "() => showAll()"
      />
    </div>
  </div>
</template>


<script lang="ts">
  export interface ContinueReadingContainerProps {
    constrainedHeight? : number;
    marginOfError?     : number;
  }
</script>


<script setup lang="ts">
  import { useElementSize } from '@vueuse/core';
  import { nextTick, ref, watchEffect } from 'vue';
  import { useReseeUxStore } from '../stores/use-resee-ux-store';
  import Button from './Button.vue';

  const props = withDefaults(
    defineProps<ContinueReadingContainerProps>(),
    {
      constrainedHeight : 350,
      marginOfError     : 36,
    },
  );

  const innerContainer = ref<HTMLElement>();
  const showAllContent = ref(false);
  const isOverflowing  = ref(false);

  const reseeUx    = useReseeUxStore();
  const { height } = useElementSize(innerContainer);

  const { stop } = watchEffect(() => {
    isOverflowing.value = height.value > props.constrainedHeight;

    if (height.value && height.value - props.constrainedHeight <= props.marginOfError) {
      nextTick(showAll);
    }
  });

  function showAll() {
    stop();
    showAllContent.value = true;
  }
</script>


<style scoped>
.continue-reading {
  > div:nth-child(1) {
    max-height : calc(v-bind(constrainedHeight) * 1px);
    overflow   : hidden;

    &.show-all {
      max-height: unset;
    }
  }

  > div:nth-child(2) {
    text-align : center;
    margin-top : -1rem;
    position   : relative;
    z-index    : 1;
  }
}
</style>
