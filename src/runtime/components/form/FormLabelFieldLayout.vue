<template>
  <div :class="['label-field-layout', `label-${ props.labelPosition }`]">
    <slot name="label">
      <FormLabel
        :inputId     = "props.inputId"
        :labelId     = "props.labelId"
        :labelText   = "props.labelText"
        :labelSrOnly = "props.labelSrOnly"
        :labelIs     = "props.labelIs"
        :required    = "props.required"
        :disabled    = "props.disabled"
        :fauxLabel   = "props.fauxLabel"
        :noteText    = "props.noteText && showNoteInLabel ? props.noteText : undefined"
      />
    </slot>

    <div>
      <slot name="input" />
    </div>

    <slot name="note">
      <FormNote
        v-if       = "props.noteText && !showNoteInLabel"
        :note-text = "props.noteText"
      />
    </slot>

    <slot name="validation">
      <FormValidationMessage
        v-if     = "props.validationId"
        :id      = "props.validationId"
        :visible = "props.showValidation"
        :message = "props.validationText"
      />
    </slot>
  </div>
</template>


<script lang="ts">
  import type { FormLabelProps } from './FormLabel.vue';

  export interface FormLabelFieldLayoutProps extends FormLabelProps {
    labelPosition?  : 'above' | 'before' | 'after';
    notePosition?   : 'in-label';
    noteText?       : string;
    validationId?   : string;
    validationText? : string;
    showValidation? : boolean;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import FormLabel from './FormLabel.vue';
  import FormNote from './FormNote.vue';
  import FormValidationMessage from './FormValidationMessage.vue';

  const props = withDefaults(
    defineProps<FormLabelFieldLayoutProps>(),
    {
      labelPosition : 'above',
      labelSrOnly   : false,
      labelIs       : undefined,
      required      : false,
      disabled      : false,
      fauxLabel     : false,
      notePosition  : undefined,
      noteText      : undefined,
    },
  );

  const showNoteInLabel = computed(() => {
    return props.notePosition === 'in-label'
      || props.labelIs === 'legend'
      || props.labelPosition === 'before'
      || props.labelPosition === 'after';
  });
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    .label-field-layout {
      display        : flex;
      flex-direction : column;
      gap            : --spacing(1);
      position       : relative;

      > *:nth-child(1) {
        flex-grow: 1;
      }

      &:deep(.input-validation) {
        position  : absolute;
        bottom    : 0;
        transform : translateY(110%);
      }

      p + :deep(.input-validation) {
        transform: translateY(85%);
      }
    }

    .label-field-layout.label-before,
    .label-field-layout.label-after {
      flex-direction : row;
      gap            : --spacing(3);
      align-items    : center;

      &:deep(.input-validation) {
        transform: translateY(85%);
      }
    }

    .label-field-layout.label-after {
      > *:nth-child(1) {
        order: 2;
      }
    }
  }
</style>
