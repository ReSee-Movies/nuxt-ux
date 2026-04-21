<template>
  <div class="@container">
    <div :class="['form-grid', 'not-prose', props.gridClass]">
      <template
        v-for = "(field, index) of props.fields"
        :key  = "getEnumerationKey(field, index)"
      >
        <div
          v-if   = "field.fieldType === 'heading'"
          :class = "[
            field.gridCellClass,
            props.gridCellClass,
            props.gridCellFullClass,
            'mt-6 -mb-6 first:mt-0',
          ]"
        >
          <FormElementHeading :heading="field.heading" :subheading="field.subheading" />
        </div>

        <div
          v-else
          :class="[
            field.gridCellClass,
            props.gridCellClass,
            (applyVariantStyling(field) ? `variant-${ props.variant }` : undefined),
            (field.width !== 'half' ? props.gridCellFullClass : props.gridCellHalfClass),
          ]"
        >
          <Component :is="getComponent(field)" v-bind="field" />
        </div>
      </template>
    </div>
  </div>
</template>


<script lang="ts">
  import type { HTMLElementClassNames } from '../../types';
  import type { FormFieldCheckboxProps } from './FormFieldCheckbox.vue';
  import type { FormFieldCheckboxGroupProps } from './FormFieldCheckboxGroup.vue';
  import type { FormFieldRadioGroupProps } from './FormFieldRadioGroup.vue';
  import type { FormFieldSelectProps } from './FormFieldSelect.vue';
  import type { FormFieldSelectButtonProps } from './FormFieldSelectButton.vue';
  import type { FormFieldTextProps } from './FormFieldText.vue';
  import type { FormFieldTextareaProps } from './FormFieldTextarea.vue';
  import type { FormFieldToggleSwitchProps } from './FormFieldToggleSwitch.vue';
  import type { FormFieldTurnstileProps } from './FormFieldTurnstile.vue';
  import type { FormSubmitButtonProps } from './FormSubmitButton.vue';

  export interface CommonOptions {
    width?         : 'full' | 'half';
    gridCellClass? : HTMLElementClassNames;
  }

  export interface CheckboxField extends FormFieldCheckboxProps, CommonOptions {
    fieldType: 'checkbox';
  }

  export interface CheckboxGroupField extends FormFieldCheckboxGroupProps, CommonOptions {
    fieldType: 'checkbox-group';
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

  export interface HeadingField {
    fieldType      : 'heading';
    heading        : string;
    subheading?    : string;
    gridCellClass? : string;
  }

  export type FormFieldBuilderOption
    = CheckboxField
      | CheckboxGroupField
      | SelectField
      | SelectButtonField
      | RadioGroup
      | TextField
      | TextareaField
      | ToggleSwitchField
      | TurnstileField
      | SubmitButton
      | HeadingField;

  export interface FormFieldBuilderProps {
    fields             : undefined | FormFieldBuilderOption[];
    gridClass?         : string;
    gridCellClass?     : string;
    gridCellHalfClass? : string;
    gridCellFullClass? : string;
    variant?           : 'blocks';
  }
</script>


<script setup lang="ts">
  import FormElementHeading from './element/FormElementHeading.vue';
  import CheckboxField from './FormFieldCheckbox.vue';
  import CheckboxFieldGroup from './FormFieldCheckboxGroup.vue';
  import SelectField from './FormFieldSelect.vue';
  import SelectButtonField from './FormFieldSelectButton.vue';
  import SubmitButton from './FormSubmitButton.vue';
  import RadioGroup from './FormFieldRadioGroup.vue';
  import TextField from './FormFieldText.vue';
  import TextareaField from './FormFieldTextarea.vue';
  import ToggleSwitchField from './FormFieldToggleSwitch.vue';
  import TurnstileField from './FormFieldTurnstile.vue';

  const props = withDefaults(
    defineProps<FormFieldBuilderProps>(),
    {
      gridClass         : 'grid grid-cols-1 gap-x-4 gap-y-10 sm:@lg:grid-cols-2 sm:@lg:gap-y-7',
      gridCellClass     : undefined,
      gridCellHalfClass : undefined,
      gridCellFullClass : 'sm:@lg:col-span-2',
      variant           : undefined,
    },
  );

  function getComponent(field: FormFieldBuilderOption) {
    switch (field.fieldType) {
      case 'checkbox' : return CheckboxField;
      case 'checkbox-group' : return CheckboxFieldGroup;
      case 'select' : return SelectField;
      case 'select-button' : return SelectButtonField;
      case 'radio' : return RadioGroup;
      case 'text' : return TextField;
      case 'textarea' : return TextareaField;
      case 'toggle' : return ToggleSwitchField;
      case 'turnstile' : return TurnstileField;
      case 'submit' : return SubmitButton;
      default : return 'div';
    }
  }

  function getEnumerationKey(field: FormFieldBuilderOption, idx: number) {
    if ('name' in field) {
      return field.name;
    }

    if ('heading' in field) {
      return field.heading;
    }

    return idx;
  }

  function applyVariantStyling(field: FormFieldBuilderOption) {
    return props.variant && field.fieldType !== 'submit' && field.fieldType !== 'turnstile';
  }
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    .form-grid {
      > .variant-blocks {
        background-color : var(--color-background-scale-a);
        border-radius    : var(--radius-md);
        padding          : 0 --spacing(4) --spacing(4);

        &:has(.input-validation.visible) {
          padding-bottom: --spacing(7);
        }

        &:not(:has(.label-field-layout.label-above > .input-label)) {
          padding-top: --spacing(4);
        }

        &:deep(.label-field-layout.label-above > .input-label) {
          background-color        : var(--color-background-scale-c);
          padding                 : --spacing(1) --spacing(4) --spacing(0.5);
          margin                  : 0 --spacing(-4) --spacing(4);
          border-top-left-radius  : var(--radius-md);
          border-top-right-radius : var(--radius-md);
          border-bottom           : solid 1px var(--color-background-scale-d);
        }

        &:deep(.form-field-radiogroup .label-field-layout.label-after) {
          border-bottom : solid 1px var(--color-background-scale-d);
          padding       : --spacing(2) 0;
          margin-bottom : 0 !important;

          &:first-child {
            padding-top: 0;
          }

          &:last-child {
            border-bottom  : none;
            padding-bottom : 0;
          }
        }
      }
    }
  }
</style>
