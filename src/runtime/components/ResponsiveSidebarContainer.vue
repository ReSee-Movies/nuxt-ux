<template>
  <ScrollPinnedContainer
    v-if         = "isColumn"
    :full-height = "props.columnFullHeight"
  >
    <slot :state="containerState" :is-drawer="isDrawer" :is-column="isColumn" />
  </ScrollPinnedContainer>

  <Drawer
    v-else-if       = "isDrawer"
    v-model:visible = "drawerVisible"
    :position       = "props.drawerPosition"
    :header         = "props.drawerHeader"
    @click          = "handleDrawerClick"
  >
    <slot :state="containerState" :is-drawer="isDrawer" :is-column="isColumn" />
  </Drawer>

  <div v-else>
    <slot :state="containerState" :is-drawer="isDrawer" :is-column="isColumn" />
  </div>
</template>


<script lang="ts">
  import type { DrawerProps } from './Drawer.vue';

  export type ResponseSidebarContainerState = 'column' | 'drawer' | 'unknown';

  export interface ResponsiveSidebarContainerProps {
    drawerPosition?   : DrawerProps['position'];
    drawerHeader?     : DrawerProps['header'];
    switchPoint?      : 'md' | 'lg';
    columnFullHeight? : boolean;
  }

  export interface ResponsiveSidebarContainerEmits {
    (e: 'stateChange', containerState: ResponseSidebarContainerState): void;
  }
</script>


<script setup lang="ts">
  import { useMounted } from '@vueuse/core';
  import { computed, watch } from 'vue';
  import { useReseeBreakpoints } from '../composables/use-resee-breakpoints';
  import Drawer from './Drawer.vue';
  import ScrollPinnedContainer from './ScrollPinnedContainer.vue';

  const props = withDefaults(
    defineProps<ResponsiveSidebarContainerProps>(),
    {
      drawerPosition   : 'right',
      drawerHeader     : undefined,
      switchPoint      : 'lg',
      columnFullHeight : false,
    },
  );

  const emits = defineEmits<ResponsiveSidebarContainerEmits>();

  const drawerVisible      = defineModel<boolean | undefined>('drawerVisible', undefined);
  const isComponentMounted = useMounted();
  const isAtOrAboveSwitch  = useReseeBreakpoints().greaterOrEqual(props.switchPoint);

  const containerState = computed<ResponseSidebarContainerState>(() => {
    if (!isComponentMounted.value) {
      return 'unknown';
    }

    return isAtOrAboveSwitch.value ? 'column' : 'drawer';
  });

  const isDrawer = computed(() => containerState.value === 'drawer');
  const isColumn = computed(() => containerState.value === 'column');

  watch(containerState, () => {
    emits('stateChange', containerState.value);

    if (!isDrawer.value) {
      drawerVisible.value = undefined;
    }
  }, { immediate: true });

  function handleDrawerClick(event: InputEvent) {
    if (isDrawer.value && event.target instanceof HTMLElement && event.target.closest('a')) {
      drawerVisible.value = false;
    }
  }
</script>
