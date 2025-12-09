<template>
  <div class="@container">
    <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:@lg:grid-cols-2 sm:@lg:gap-y-7">
      <template v-for="(field, index) of props.fields" :key="field.name ?? index">
        <Component
          :is    = "getComponent(field)"
          v-bind = "field"
          :class = "{
            'sm:@lg:col-span-2': field.width !== 'half',
          }"
        />
      </template>
    </div>
  </div>
</template>


<script lang="ts">
  import type { FormFieldCheckboxProps } from './FormFieldCheckbox.vue';
  import type { FormFieldRadioGroupProps } from './FormFieldRadioGroup.vue';
  import type { FormFieldSelectProps } from './FormFieldSelect.vue';
  import type { FormFieldSelectButtonProps } from './FormFieldSelectButton.vue';
  import type { FormFieldTextProps } from './FormFieldText.vue';
  import type { FormFieldTextareaProps } from './FormFieldTextarea.vue';
  import type { FormFieldToggleSwitchProps } from './FormFieldToggleSwitch.vue';
  import type { FormFieldTurnstileProps } from './FormFieldTurnstile.vue';
  import type { FormSubmitButtonProps } from './FormSubmitButton.vue';

  export interface CommonOptions {
    width?: 'full' | 'half';
  }

  export interface CheckboxField extends FormFieldCheckboxProps, CommonOptions {
    fieldType: 'checkbox';
  }

  export interface SelectField extends FormFieldSelectProps, CommonOptions {
    fieldType: 'select';
  }

  export interface SelectButtonField extends FormFieldSelectButtonProps, CommonOptions {
    fieldType: 'select-button';
  }

  export interface RadioGroup extends FormFieldRadioGroupProps, CommonOptions {
    fieldType: 'radio';
  }

  export interface TextField extends FormFieldTextProps, CommonOptions {
    fieldType: 'text';
  }

  export interface TextareaField extends FormFieldTextareaProps, CommonOptions {
    fieldType: 'textarea';
  }

  export interface ToggleSwitchField extends FormFieldToggleSwitchProps, CommonOptions {
    fieldType: 'toggle';
  }

  export interface TurnstileField extends FormFieldTurnstileProps, CommonOptions {
    fieldType: 'turnstile';
  }

  export interface SubmitButton extends FormSubmitButtonProps, CommonOptions {
    fieldType: 'submit';
  }

  export type FormFieldBuilderOption
    = CheckboxField
    | SelectField
    | SelectButtonField
    | RadioGroup
    | TextField
    | TextareaField
    | ToggleSwitchField
    | TurnstileField
    | SubmitButton;

  export interface FormFieldBuilderProps {
    fields: undefined | FormFieldBuilderOption[];
  }
</script>


<script setup lang="ts">
  import { h } from 'vue';
  import EmptyDiv from './element/FormElementEmptyDiv.vue';
  import CheckboxField from './FormFieldCheckbox.vue';
  import SelectField from './FormFieldSelect.vue';
  import SelectButtonField from './FormFieldSelectButton.vue';
  import SubmitButton from './FormSubmitButton.vue';
  import RadioGroup from './FormFieldRadioGroup.vue';
  import TextField from './FormFieldText.vue';
  import TextareaField from './FormFieldTextarea.vue';
  import ToggleSwitchField from './FormFieldToggleSwitch.vue';
  import TurnstileField from './FormFieldTurnstile.vue';

  const props = defineProps<FormFieldBuilderProps>();

  function getComponent(field: FormFieldBuilderOption) {
    switch (field.fieldType) {
      case 'checkbox'      : return CheckboxField;
      case 'select'        : return SelectField;
      case 'select-button' : return SelectButtonField;
      case 'radio'         : return RadioGroup;
      case 'text'          : return TextField;
      case 'textarea'      : return TextareaField;
      case 'toggle'        : return ToggleSwitchField;
      case 'turnstile'     : return TurnstileField;
      case 'submit'        : return h(EmptyDiv, { class: 'text-end' }, h(SubmitButton));
      default              : return 'div';
    }
  }
</script>
