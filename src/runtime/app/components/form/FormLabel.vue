<template>
  <Component
    :is    = "labelTagName"
    :id    = "props.labelId"
    :for   = "labelTagName === 'label' ? props.inputId : undefined"
    :class = "[
      'input-label',
      {
        'sr-only'  : props.labelSrOnly,
        'disabled' : props.disabled,
        'required' : props.required,
      },
    ]"
  >
    <span class="label-inner">
      <slot>
        {{ props.labelText }}
      </slot>
    </span>

    <slot name="note">
      <FormNote
        v-if       = "props.noteText"
        note-is    = "span"
        class      = "block"
        :note-text = "props.noteText"
      />
    </slot>
  </Component>
</template>


<script lang="ts">
  import type { HintedString } from '../../types';

  export interface FormLabelProps {
    inputId?     : string;
    labelId?     : string;
    labelText?   : string;
    labelSrOnly? : boolean;
    labelIs?     : HintedString<'label' | 'legend' | 'span'>;
    required?    : boolean;
    disabled?    : boolean;
    fauxLabel?   : boolean;
    noteText?    : string;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import FormNote from './FormNote.vue';

  const props = withDefaults(
    defineProps<FormLabelProps>(),
    {
      labelPosition : 'above',
      labelSrOnly   : false,
      labelIs       : undefined,
      required      : false,
      disabled      : false,
      fauxLabel     : false,
      noteText      : undefined,
    },
  );

  const labelTagName = computed(
    () => props.labelIs ?? (props.fauxLabel ? 'span' : 'label'),
  );
</script>
