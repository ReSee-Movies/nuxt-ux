<template>
  <div
    :class="[
      'sidebar-layout',
      {
        'collapse-md'  : props.switchPoint === 'md',
        'collapse-lg'  : props.switchPoint === 'lg',
        'orient-left'  : props.sidebarPosition === 'left',
        'orient-right' : props.sidebarPosition === 'right',
      },
    ]"
  >
    <div>
      <slot name="content" :sidebar-state="sidebarState" />
    </div>

    <div>
      <ResponsiveSidebarContainer
        v-model:drawer-visible = "drawerVisible"
        :drawer-position       = "props.drawerPosition ?? props.sidebarPosition"
        :drawer-header         = "props.drawerHeader"
        :switch-point          = "props.switchPoint"
        :column-full-height    = "props.columnFullHeight"
        @state-change          = "handleSidebarStateChange"
      >
        <slot name="sidebar" :sidebar-state="sidebarState" />
      </ResponsiveSidebarContainer>
    </div>
  </div>
</template>


<script lang="ts">
  import type {
    ResponsiveSidebarContainerEmits,
    ResponsiveSidebarContainerProps,
    ResponseSidebarContainerState,
  } from './ResponsiveSidebarContainer.vue';

  export interface ResponsiveSidebarLayoutProps extends ResponsiveSidebarContainerProps {
    sidebarPosition?: 'left' | 'right';
  }
</script>


<script setup lang="ts">
  import { ref } from 'vue';
  import ResponsiveSidebarContainer from './ResponsiveSidebarContainer.vue';

  const props = withDefaults(
    defineProps<ResponsiveSidebarLayoutProps>(),
    {
      sidebarPosition  : 'right',
      switchPoint      : 'lg',
      columnFullHeight : false,
    },
  );

  const emits = defineEmits<ResponsiveSidebarContainerEmits>();

  const drawerVisible = defineModel<boolean | undefined>('drawerVisible', { default: undefined });
  const sidebarState  = ref<ResponseSidebarContainerState>('unknown');

  function handleSidebarStateChange(state: ResponseSidebarContainerState) {
    sidebarState.value = state;
    emits('stateChange', state);
  }
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    .sidebar-layout {
      --grid-cols-sidebar-right : 1fr 16rem;
      --grid-cols-sidebar-left  : 16rem 1fr;
      --sidebar-border          : solid 1px var(--color-global-background-accent);
      --sidebar-border-gap      : --spacing(4);

      display: grid;

      &.collapse-lg {
        @variant lg {
          &.orient-right {
            grid-template-columns: var(--grid-cols-sidebar-right);

            & > div:first-child {
              border-right  : var(--sidebar-border);
              padding-right : var(--sidebar-border-gap);
              margin-right  : var(--sidebar-border-gap);
            }
          }

          &.orient-left {
            grid-template-columns: var(--grid-cols-sidebar-left);

            & > div:first-child {
              order        : 2;
              border-left  : var(--sidebar-border);
              padding-left : var(--sidebar-border-gap);
              margin-left  : var(--sidebar-border-gap);
            }
          }
        }
      }

      &.collapse-md {
        @variant md {
          &.orient-right {
            grid-template-columns: var(--grid-cols-sidebar-right);

            & > div:first-child {
              border-right  : var(--sidebar-border);
              padding-right : var(--sidebar-border-gap);
              margin-right  : var(--sidebar-border-gap);
            }
          }

          &.orient-left {
            grid-template-columns: var(--grid-cols-sidebar-left);

            & > div:first-child {
              order        : 2;
              border-left  : var(--sidebar-border);
              padding-left : var(--sidebar-border-gap);
              margin-left  : var(--sidebar-border-gap);
            }
          }
        }
      }
    }
  }
</style>
