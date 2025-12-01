<template>
  <div :class="['input-label-pair', `label-${ props.labelPosition }`]">
    <label
      :for   = "props.inputId"
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
    </label>

    <div>
      <slot name="input" />
    </div>
  </div>
</template>


<script lang="ts">
  export interface FormLabelInputPairProps {
    inputId        : string;
    labelText      : string;
    labelPosition? : 'above' | 'below' | 'before' | 'after';
    labelSrOnly?   : boolean;
    required?      : boolean;
    disabled?      : boolean;
  }
</script>


<script setup lang="ts">
  const props = withDefaults(
    defineProps<FormLabelInputPairProps>(),
    {
      labelPosition : 'above',
      labelSrOnly   : false,
      required      : false,
      disabled      : false,
    },
  );
</script>
