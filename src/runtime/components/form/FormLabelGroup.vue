<template>
  <Component
    :is    = "props.is"
    :class = "['label-group', props.layout ? `layout-${ props.layout }` : undefined]"
  >
    <Component
      :is    = "props.labelIs"
      :class = "['label', { required: props.required }]"
      :for   = "props.inputId"
    >
      <slot name="label">
        {{ labelText }}
      </slot>

      <span v-if="props.required" class="sr-only">
        (required)
      </span>
    </Component>

    <slot name="default" />
  </Component>
</template>


<script lang="ts">
  import type { HintedString } from '../../types';

  export interface FormLabelGroupProps {
    is?        : HintedString<'div'>;
    labelIs?   : HintedString<'label' | 'legend'>;
    labelText? : string;
    layout?    : 'inline' | 'inline-reverse';
    required?  : boolean;
    inputId?   : string;
  }
</script>


<script setup lang="ts">
  const props = withDefaults(
    defineProps<FormLabelGroupProps>(),
    {
      is        : 'div',
      labelIs   : 'label',
      labelText : undefined,
      layout    : undefined,
      required  : false,
      inputId   : undefined,
    },
  );
</script>
