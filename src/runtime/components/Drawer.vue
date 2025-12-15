<template>
  <PrimeDrawer
    :class           ="['drawer', `drawer-${ props.position ?? 'left' }`]"
    :visible         = "props.visible"
    :position        = "props.position"
    :block-scroll    = "props.blockScroll"
    :aria-label      = "props.showHeaderText ? undefined : props.header"
    :show-close-icon = "props.showCloseIcon"
    :pt              = "passthroughProps"
    @update:visible  = "updatedValue => emits('update:visible', updatedValue)"
  >
    <template #container="{ closeCallback }">
      <div v-if="props.showHeaderText || props.showCloseIcon" class="header">
        <div class="title">
          <slot v-if="props.showHeaderText" name="title">
            {{ props.header }}
          </slot>
        </div>

        <div>
          <CloseButton @click="closeCallback" />
        </div>
      </div>

      <div class="content">
        <slot />
      </div>
    </template>
  </PrimeDrawer>
</template>


<script lang="ts">
  import { calculateBodyScrollbarWidth } from '@primeuix/utils';
  import type { DrawerProps as PrimeDrawerProps } from 'primevue';

  export interface DrawerProps extends PrimeDrawerProps {
    showHeaderText?: boolean;
  }
</script>


<script setup lang="ts">
  import { computed } from 'vue';
  import PrimeDrawer from 'primevue/drawer';
  import CloseButton from './CloseButton.vue';

  const props = withDefaults(
    defineProps<DrawerProps>(),
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
      root: () => ({
        style: `--outgoing-scrollbar-width: ${ calculateBodyScrollbarWidth() }px;`,
      }),

      mask: {
        class: 'occlude-background',
      },

      transition: () => ({
        name: `slide-in-${ props.position ?? 'left' }`,
      }),
    };
  });
</script>


<!-- Since the Drawer component is teleported, it's styles cannot be scoped here. -->
<style>
  @reference "tailwindcss";

  @layer components {
    .drawer {
      --outgoing-scrollbar-width : 0px;
      --drawer-border-radius : --spacing(3);
      --drawer-spacing       : 15px;
      --drawer-spacing-end   : calc(var(--drawer-spacing) - var(--outgoing-scrollbar-width) + var(--p-scrollbar-width));

      /*
       To explain the `--drawer-spacing` variables. Primevue sets the `--p-scrollbar-width` variable to the
       pixel width of the scrollbar whenever it disables scrolling by setting the body's overflow to hidden.
       This value can then be used to make up space that the scrollbar occupied via whatever mechanism is desired,
       and therefore avoid everything on the page reflowing into that newly freed up space - this is a good thing.

       The only problem here is that Primevue sets that variable _after_ the open/close transitions have taken
       place for the Drawer component, and so the fact that "there is a scrollbar now, but soon there will not be"
       needs to be taken into account in a way that keeps the overall size and layout of the Drawer unchanged.
       To do this, we take our own measurement of the scrollbar and use that to offset all of the content on the side
       that the scrollbar will be disappearing from. The result is an effect that looks like the Drawer is sliding in
       behind the scrollbar. Not perfect, but pretty decent.
       */

      background           : var(--color-global-background);
      border-color         : var(--color-global-background-accent);
      padding-block        : var(--drawer-spacing);
      padding-inline-start : var(--drawer-spacing);
      padding-inline-end   : var(--drawer-spacing-end);
      display              : flex;
      flex-direction       : column;
      gap                  : var(--drawer-spacing);

      &.drawer-left {
        --drawer-spacing-end: var(--drawer-spacing);

        border-right-width         : 1px;
        border-top-right-radius    : var(--drawer-border-radius);
        border-bottom-right-radius : var(--drawer-border-radius);
        height                     : 100%;
        width                      : --spacing(80);
        box-shadow                 : var(--shadow-heavy-right);
      }

      &.drawer-right {
        border-left-width         : 1px;
        border-top-left-radius    : var(--drawer-border-radius);
        border-bottom-left-radius : var(--drawer-border-radius);
        height                    : 100%;
        width                     : calc(--spacing(80) + var(--p-scrollbar-width));
        box-shadow                : var(--shadow-heavy-left);
      }

      &.drawer-top {
        border-bottom-width        : 1px;
        border-bottom-left-radius  : var(--drawer-border-radius);
        border-bottom-right-radius : var(--drawer-border-radius);
        width                      : 100%;
        max-height                 : --spacing(100);
        box-shadow                 : var(--shadow-heavy);
      }

      &.drawer-bottom {
        border-top-width        : 1px;
        border-top-left-radius  : var(--drawer-border-radius);
        border-top-right-radius : var(--drawer-border-radius);
        width                   : 100%;
        max-height              : --spacing(100);
        box-shadow              : var(--shadow-heavy-top);
      }
    }

    .drawer .header {
      display: flex;
      align-items         : center;
      padding-bottom      : var(--drawer-spacing);
      border-bottom       : solid 1px var(--color-global-background-accent);

      .title {
        flex-grow : 1;
        font-size : var(--text-lg);
      }
    }

    .drawer .content {
      flex-grow  : 1;
      overflow-y : auto;
    }
  }
</style>
