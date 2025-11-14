<template>
  <PrimeDialog
    :visible          = "props.visible"
    :modal            = "props.modal"
    :closable         = "props.closable"
    :draggable        = "props.draggable"
    :header           = "props.showHeaderText ? props.header : undefined"
    :show-header      = "props.showHeader"
    :aria-label       = "props.showHeader && props.showHeaderText ? undefined : props.header"
    :footer           = "props.footer"
    :dismissable-mask = "props.dismissableMask"
    :position         = "props.position"
    :class            = "['dialog', dialogWidth]"
    :content-class    = "props.contentClass"
    :pt               = "passthroughProps"
    :aria-labelledby  = "dialogLabelledBy"
    @update:visible   = "updatedValue => emits('update:visible', updatedValue)"
  >
    <template #header>
      <div class="title" :id="dialogLabelledBy">
        <slot v-if="props.showHeaderText" name="title">
          {{ props.header }}
        </slot>
      </div>
    </template>

    <template #closebutton="{ closeCallback }">
      <CloseButton @click="closeCallback" />
    </template>

    <template #default>
      <slot />
    </template>
  </PrimeDialog>
</template>


<script lang="ts">
  import type { DialogProps as PrimeDialogProps } from 'primevue';

  export type DialogProps = {
    size?           : 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
    showHeaderText? : boolean;
  } & PrimeDialogProps;
</script>


<script setup lang="ts">
  import { computed, useId, useAttrs } from 'vue';
  import PrimeDialog from 'primevue/dialog';
  import CloseButton from './CloseButton.vue';

  const props = withDefaults(
    defineProps<DialogProps>(),
    {
      modal           : true,
      closable        : true,
      draggable       : false,
      size            : 'md',
      dismissableMask : true,
      showHeader      : true,
      showHeaderText  : true,
      position        : undefined,
      contentClass    : undefined,
    },
  );

  const emits = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
  }>();

  const attrs = useAttrs();

  const dialogId = useId();

  const dialogWidth = computed(() => {
    switch (props.size) {
      case 'lg'  : return 'max-w-5xl';
      case 'sm'  : return 'max-w-xl';
      case 'xs'  : return 'max-w-md';
      case 'xxs' : return 'max-w-sm';
      default    : return 'max-w-3xl';
    }
  });

  const dialogLabelledBy = computed(() => {
    return !attrs['aria-label'] ? `${ dialogId }_header` : undefined;
  });

  const passthroughProps = computed(() => {
    return {
      header: {
        class: 'header',
      },

      content: {
        class: 'content',
      },

      mask: {
        class: 'occlude-background',
      },

      transition: {
        name: 'scale',
      },
    };
  });
</script>


<style>
  @reference "tailwindcss";

  .dialog {
    border           : solid 1px var(--color-global-background-accent);
    border-radius    : var(--radius-md);
    background-color : var(--color-global-background);
    overflow         : clip;
    width            : 100%;
    height           : calc(100% - --spacing(4));
    margin           : --spacing(2);

    @variant sm {
      box-shadow : var(--shadow-heavy);
      height     : auto;
    }
  }

  .dialog .header {
    display        : flex;
    align-items    : center;
    gap            : --spacing(3);
    margin-inline  : --spacing(3);
    margin-top     : --spacing(3);
    padding-bottom : --spacing(3);
    border-bottom  : solid 1px var(--color-global-background-accent);

    .title {
      flex-grow : 1;
      font-size : var(--text-lg);
    }
  }

  .dialog .content {
    padding    : --spacing(3);
    overflow-y : auto;
  }
</style>
