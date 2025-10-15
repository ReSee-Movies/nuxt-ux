<template>
  <PrimeDrawer
    :class          ="['drawer', `drawer-${ props.position ?? 'left' }`]"
    :visible        = "props.visible"
    :position       = "props.position"
    :block-scroll   = "props.blockScroll"
    :aria-label     = "props.showHeaderText ? undefined : props.header"
    :pt             = "passthroughProps"
    @update:visible = "updatedValue => emits('update:visible', updatedValue)"
  >
    <template #closebutton="{ closeCallback }">
      <UiCloseButton @click="closeCallback" />
    </template>

    <template #header>
      <div class="title">
        <slot v-if="props.showHeaderText" name="title">
          {{ props.header }}
        </slot>
      </div>
    </template>

    <template #default>
      <slot />
    </template>
  </PrimeDrawer>
</template>


<script lang="ts">
  import { calculateBodyScrollbarWidth } from '@primeuix/utils';
  import type { DrawerProps } from 'primevue';

  export type UiDrawerProps = {
    showHeaderText?: boolean;
  } & DrawerProps;
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import UiCloseButton from './UiCloseButton.vue';

  const props = withDefaults(
    defineProps<UiDrawerProps>(),
    {
      showHeaderText : true,
      blockScroll    : true,
    },
  );

  const emits = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
  }>();

  const passthroughProps = computed(() => {
    return {
      header() {
        return {
          class: [
            'header',
            {
              'me-3': props.position !== 'right' || calculateBodyScrollbarWidth() === 0,
            },
          ],
        }
      },

      content: {
        class: 'content',
      },

      mask() {
        return {
          class: [
            'occlude-background',
            {
              'replace-scrollbar': props.position === 'right',
            },
          ],
        }
      },

      transition: {
        name: `slide-in-${ props.position ?? 'left' }`,
      },
    };
  });
</script>


<style>
  @reference "tailwindcss";

  .drawer {
    background   : var(--color-global-background);
    border-color : var(--color-global-background-accent);

    &.drawer-left {
      border-right-width : 1px;
      height             : 100%;
      width              : --spacing(80);
      box-shadow         : var(--shadow-heavy-right);
    }

    &.drawer-right {
      border-left-width  : 1px;
      height             : 100%;
      width              : --spacing(80);
      box-shadow         : var(--shadow-heavy-left);
    }

    &.drawer-top {
      border-bottom-width : 1px;
      width               : 100%;
      box-shadow         : var(--shadow-heavy);
    }

    &.drawer-bottom {
      border-top-width : 1px;
      width            : 100%;
      box-shadow         : var(--shadow-heavy-top);
    }
  }

  .drawer .header {
    display             : flex;
    align-items         : center;
    margin-inline-start : --spacing(3);
    margin-top          : --spacing(3);
    padding-bottom      : --spacing(3);
    border-bottom       : solid 1px var(--color-global-background-accent);

    .title {
      flex-grow : 1;
      font-size : var(--text-lg);
    }
  }

  .drawer .content {
    padding-top          : --spacing(3);
    padding-bottom       : --spacing(3);
    padding-inline-start : --spacing(3);
    height               : 100%;
    width                : 100%;
    overflow-y           : auto;
  }
</style>
