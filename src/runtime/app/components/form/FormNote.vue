<template>
  <Component :is="props.noteIs" class="text-sm text-global-foreground-accent">
    <slot>
      {{ props.noteText }}
    </slot>
  </Component>
</template>


<script lang="ts">
  import type { HintedString } from '../../types';

  export interface FormNoteProps {
    noteIs?   : HintedString<'p' | 'span'>;
    noteText? : string;
  }
</script>


<script setup lang="ts">
  const props = withDefaults(
    defineProps<FormNoteProps>(),
    {
      noteIs   : 'p',
      noteText : undefined,
    },
  );
</script>
