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
    :class            = "['dialog', dialogWidth, { 'dialog-styles': props.showModalStyle, 'dialog-sidebar-header': props.sidebarHeader }]"
    :content-class    = "props.contentClass"
    :pt               = "passthroughProps"
    :aria-labelledby  = "dialogLabelledBy"
    @update:visible   = "updatedValue => emits('update:visible', updatedValue)"
  >
    <template #header>
      <div :id="dialogLabelledBy" class="dialog-header-title">
        <slot v-if="props.showHeaderText" name="title">
          <span>{{ props.header }}</span>
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

  export interface DialogProps extends PrimeDialogProps {
    size?            : 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
    showHeaderText?  : boolean;
    showHeaderStyle? : boolean;
    showModalStyle?  : boolean;
    sidebarHeader?   : boolean;
  }
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
      showHeaderStyle : true,
      showModalStyle  : true,
      position        : undefined,
      contentClass    : undefined,
      sidebarHeader   : false,
    },
  );

  const emits = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
  }>();

  const attrs = useAttrs();

  const dialogId = useId();

  const dialogWidth = computed(() => {
    switch (props.size) {
      case 'lg' : return 'max-w-5xl';
      case 'sm' : return 'max-w-xl';
      case 'xs' : return 'max-w-md';
      case 'xxs' : return 'max-w-sm';
      default : return 'max-w-3xl';
    }
  });

  const dialogLabelledBy = computed(() => {
    return !attrs['aria-label'] ? `${ dialogId }_header` : undefined;
  });

  const passthroughProps = computed(() => {
    return {
      header: () => ({
        class: ['dialog-header', { 'header-styles': props.showHeaderStyle }],
      }),

      content: {
        class: 'dialog-content',
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


<!-- Since the Dialog component is teleported, it's styles cannot be scoped here. -->
<style>
  @reference "tailwindcss";

  @layer components {
    .dialog {
      width      : 100%;
      margin     : --spacing(2);
      max-height : calc(100vh - --spacing(4));
      overflow   : clip;

      .dialog-header {
        display        : flex;
        align-items    : center;
        gap            : --spacing(3);
        padding-bottom : --spacing(3);

        .dialog-header-title {
          flex-grow : 1;
          font-size : var(--text-lg);
        }
      }

      .dialog-content {
        overflow-y : auto;
      }
    }

    .dialog.dialog-styles {
      border           : solid 1px var(--color-global-background-accent);
      border-radius    : var(--radius-md);
      background-color : var(--color-global-background);
      height           : calc(100vh - --spacing(4));

      @variant sm {
        box-shadow : var(--shadow-heavy);
        height     : auto;
      }

      .dialog-header {
        margin-inline : --spacing(3);
        margin-top    : --spacing(3);

        &.header-styles {
          border-bottom: solid 1px var(--color-global-background-accent);
        }
      }

      .dialog-content {
        padding: --spacing(3);
      }
    }

    @variant landscape {
      .dialog.dialog-sidebar-header {
        display        : flex;
        flex-direction : row !important;

        .dialog-content {
          flex-grow: 1;
        }

        .dialog-header {
          order          : 2;
          flex-direction : column;
          padding-bottom : 0;
          padding-left   : --spacing(3);
          margin-left    : 0;

          .dialog-header-title {
            order            : 2;
            writing-mode     : vertical-lr;
            text-orientation : mixed;
          }

          &.header-styles {
            border-bottom  : none;
          }
        }

        &.dialog-styles {
          .dialog-header.header-styles {
            border-left: solid 1px var(--color-global-background-accent);
          }
        }
      }
    }
  }
</style>
