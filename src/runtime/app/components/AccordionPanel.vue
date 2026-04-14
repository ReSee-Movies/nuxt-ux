<template>
  <PrimeAccordionPanel
    class          = "panel"
    :value         = "props.value ?? props.title"
    :disabled      = "props.disabled"
  >
    <PrimeAccordionHeader class="header">
      <slot name="header">
        <span class="title">{{ props.title }}</span>
      </slot>
    </PrimeAccordionHeader>

    <PrimeAccordionContent
      class               = "content"
      :pt:content-wrapper = "{ class: 'wrapper' }"
      :pt:content         = "{ class: 'inner' }"
      :pt:transition      = "{ name: 'collapsible' }"
    >
      <slot />
    </PrimeAccordionContent>
  </PrimeAccordionPanel>
</template>


<script lang="ts">
  export interface AccordionPanelProps {
    value?    : string | number;
    title?    : string;
    disabled? : boolean;
  }
</script>


<script setup lang="ts">
  import PrimeAccordionPanel from 'primevue/accordionpanel';
  import PrimeAccordionHeader from 'primevue/accordionheader';
  import PrimeAccordionContent from 'primevue/accordioncontent';

  const props = withDefaults(
    defineProps<AccordionPanelProps>(),
    {
      value    : undefined,
      title    : undefined,
      disabled : false,
    },
  );
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    .panel {
      border-bottom: solid 1px var(--color-global-background-accent);

      &:last-child {
        border-bottom-color: transparent;
      }
    }

    .header {
      display        : flex;
      align-items    : center;
      width          : 100%;
      text-align     : start;
      padding        : --spacing(3) --spacing(2);
      letter-spacing : var(--tracking-widest);
      font-size      : var(--text-lg);
      cursor         : pointer;
      color          : var(--color-foreground-scale-g);
      transition     : color var(--default-transition-duration);

      .title {
        flex-grow: 1;
      }

      &:disabled {
        cursor  : not-allowed;
        opacity : 0.6;
      }

      &:not(:disabled) {
        &:hover, &:focus-visible {
          color: var(--color-global-foreground);
        }
      }
    }

    .content {
      display            : grid;
      grid-template-rows : 1fr;
    }

    .content > :deep(.wrapper) {
      min-height: 0;
    }

    .content > :deep(.wrapper > .inner) {
      padding: 0 --spacing(2) --spacing(3) --spacing(2);
    }

    @keyframes expand {
      from { grid-template-rows: 0fr; }
      to   { grid-template-rows: 1fr; }
    }

    @keyframes collapse {
      from { grid-template-rows: 1fr; }
      to   { grid-template-rows: 0fr; }
    }

    .content.collapsible-enter-active {
      animation : expand 0.2s ease-out;
      overflow  : hidden;
    }

    .content.collapsible-leave-active {
      animation : collapse 0.2s ease-out;
      overflow  : hidden;
    }
  }
</style>
