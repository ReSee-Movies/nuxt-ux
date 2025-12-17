<template>
  <span role="presentation" :class="['icon', props.size]">
    <slot>
      <span :class="props.name" />
    </slot>
  </span>
</template>


<script lang="ts">
  export interface IconProps {
    name? : string;
    size? : 'sm' | 'md' | 'lg' | 'xl';
  }
</script>


<script setup lang="ts">
  const props = withDefaults(
    defineProps<IconProps>(),
    {
      name : undefined,
      size : undefined,
    },
  );
</script>

<style scoped>
  @layer components {
    .icon {
      display     : inline-flex;
      align-items : center;

      &:before {
        content: var(--zero-width-space);
      }

      /**
       * The base 1em height/width is the same that gets written in by the Tailwind
       * icon plugin, and is provided here as well just in case the stylesheet loading
       * is delayed for whatever reason.
       *
       * The usage of important isn't fantastic, but needed as the icon plugin writes
       * to the utilities layer, which takes precedence over components. The styles are
       * only applied if providing a `size="**"` prop, so shouldn't interfere with
       * any other custom solutions that involve providing other styles/classnames.
       */

      & > span {
        height  : 1em;
        width   : 1em;
        display : inline-block;
      }

      &.sm > span {
        height : var(--icon-size-small) !important;
        width  : var(--icon-size-small) !important;
      }

      &.md > span {
        height : var(--icon-size-medium) !important;
        width  : var(--icon-size-medium) !important;
      }

      &.lg > span {
        height : var(--icon-size-large) !important;
        width  : var(--icon-size-large) !important;
      }

      &.xl > span {
        height : var(--icon-size-jumbo) !important;
        width  : var(--icon-size-jumbo) !important;
      }
    }
  }
</style>
