<template>
  <div :class="['input-label-pair', `label-${ props.labelPosition }`]">
    <Component
      :is    = "labelTagName"
      :id    = "props.labelId"
      :for   = "labelTagName === 'label' ? props.inputId : undefined"
      :class = "[
        'input-label',
        {
          'sr-only' : props.labelSrOnly,
          disabled  : props.disabled,
          required  : props.required,
        }
      ]"
    >
      <slot name="label">
        {{ props.labelText }}
      </slot>
    </Component>

    <div>
      <slot name="input" />
    </div>
  </div>
</template>


<script lang="ts">
  import type { HintedString } from '../../types';

  export interface FormLabelInputPairProps {
    inputId?       : string;
    labelId?       : string;
    labelText?     : string;
    labelPosition? : 'above' | 'below' | 'before' | 'after';
    labelSrOnly?   : boolean;
    labelIs?       : HintedString<'label' | 'legend' | 'span'>;
    required?      : boolean;
    disabled?      : boolean;
    fauxLabel?     : boolean;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<FormLabelInputPairProps>(),
    {
      labelPosition : 'above',
      labelSrOnly   : false,
      labelIs       : undefined,
      required      : false,
      disabled      : false,
      fauxLabel     : false,
    },
  );

  const labelTagName = computed(
    () => props.labelIs ?? (props.fauxLabel ? 'span' : 'label'),
  );
</script>
