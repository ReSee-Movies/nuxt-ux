<template>
  <UiLayoutPageColumn :layout="formModel.layout">
    <UiLayoutPageContainer
      is               = "main"
      :heading-text    = "formModel.heading"
      :subheading-text = "formModel.subheading"
      :prose           = "formModel.prose"
    >
      <template #actions v-if="formModel.showActions">
        <NuxtLink class="a" :to="{ name: 'typography' }">
          Go to Typography
        </NuxtLink>

        <!--
        <UiButton
          aria-label = "More Info"
          icon       = "i-ph-diamonds-four"
          tooltip    = "More Info"
          @click     = "showMoreInfoModal = true"
        />

        <UiDialog v-model:visible="showMoreInfoModal" header="Some More Info">
          <UiLorem type="paragraphs" min="3" />
        </UiDialog>
        -->
      </template>

      <template #default>
        <UiForm
          v-model:values = "formModel"
          :fields        = "formFields"
        />

        <hr class="hr">
        <pre class="pre overflow-x-auto">{{ JSON.stringify(formModel, null, 2) }}</pre>
        <hr class="hr">
        <UiLorem type="paragraphs" min="10" />
      </template>
    </UiLayoutPageContainer>
  </UiLayoutPageColumn>
</template>


<script setup lang="ts">
  import type { FormFieldBuilderOption } from '#resee-ux/components/form/FormFieldBuilder.vue';
  import type { LayoutPageColumnProps } from '#resee-ux/components/LayoutPageColumn.vue';
  import { useGlobalHeaderStore } from '#resee-ux/stores/use-global-header-store';
  import { reactive } from 'vue';

  definePageMeta({
    layout  : 'basic',
    heading : 'Layout',
  });

  // const showMoreInfoModal = ref(false);

  useGlobalHeaderStore().tableOfContents([
    { text: 'Option 1', slug: 'one' },
    { text: 'Option 2', slug: 'two' },
  ]);

  const formModel = reactive({
    layout      : 'main' as LayoutPageColumnProps['layout'],
    heading     : 'Layout',
    subheading  : 'Love looks not with the eyes, but with the mind; And therefore is wing\'d Cupid painted blind.',
    showActions : true,
    prose       : false,
  });

  const formFields: FormFieldBuilderOption[] = [
    {
      fieldType   : 'select-button',
      name        : 'layout',
      optionLabel : 'label',
      optionValue : 'value',
      options     : [
        { value: 'main',  label: 'Main' },
        { value: 'vista', label: 'Vista' },
        { value: 'none',  label: 'None' },
      ],
    },
    {
      fieldType : 'text',
      name      : 'heading',
    },
    {
      fieldType : 'textarea',
      name      : 'subheading',
    },
    {
      fieldType : 'toggle',
      name      : 'showActions',
    },
    {
      fieldType   : 'select-button',
      name        : 'prose',
      optionLabel : 'label',
      optionValue : 'value',
      options     : [
        { value: false, label: 'Off' },
        { value: 'md',  label: 'Md' },
        { value: 'sm',  label: 'Sm' },
      ],
    },
  ];
</script>
