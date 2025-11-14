<template>
  <Component :is="props.is" :class="['card', props.interactive ? 'interactive' : undefined]">
    <slot>
      <div v-if="slots.image" class="image">
        <slot name="image" />
      </div>

      <div v-if="slots.content" class="content">
        <slot name="content" />
      </div>
    </slot>
  </Component>
</template>

<script setup lang="ts">
  import { useSlots } from '#imports';

  const props = withDefaults(
    defineProps<{
      is?          : string;
      interactive? : boolean;
    }>(),
    {
      is          : 'div',
      interactive : false,
    },
  );

  const slots = useSlots();
</script>

<style scoped>
  @reference "tailwindcss";

  .card {
    border                    : solid 2px var(--color-background-scale-c);
    overflow                  : clip;
    border-top-right-radius   : --spacing(2);
    border-bottom-left-radius : --spacing(2);
  }

  .card .content {
    padding: --spacing(1.5);
  }

  .card.interactive {
    user-select                : none;
    transition-property        : border-color, border-radius, box-shadow;
    transition-duration        : 500ms;
    transition-timing-function : var(--default-transition-timing-function);

    &:focus-within, &:hover {
      border-color  : var(--color-background-scale-f);
      border-radius : 0;
      box-shadow    : var(--shadow-heavy);
    }
  }
</style>
