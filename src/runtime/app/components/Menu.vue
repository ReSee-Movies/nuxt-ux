<template>
  <slot
    name      = "control"
    :toggle   = "(event: Event) => menu?.toggle(event)"
    :menu-id  = "menuId"
    :expanded = "visible"
  />

  <PrimeMenu
    v-bind     = "attrs"
    :id        = "menuId"
    ref        = "menu"
    :model     = "props.model"
    :popup     = "true"
    class      = "menu"
    :pt        = "passthroughProps"
    :append-to = "TeleportId"
  >
    <template v-if="slots.prefix || props.prefixText" #start>
      <slot name="prefix">
        {{ props.prefixText }}
      </slot>
    </template>

    <template #item="{ item }">
      <slot name="item">
        <a v-if="item.url" :href="item.url" :target="item.target">
          <IconTextPair
            :text = "isString(item.label) ? item.label : item.label?.()"
            :icon = "item.icon"
          />
        </a>

        <IconTextPair
          v-else
          :text = "isString(item.label) ? item.label : item.label?.()"
          :icon = "item.icon"
        />
      </slot>
    </template>

    <template v-if="slots.suffix || props.suffixText" #end>
      <slot name="suffix">
        {{ props.suffixText }}
      </slot>
    </template>
  </PrimeMenu>
</template>


<script lang="ts">
  import type { ComputedGetter } from 'vue';
  import type { MenuItem as PrimeMenuItem } from 'primevue/menuitem';

  export interface MenuProps {
    model       : MenuItem[];
    prefixText? : string;
    suffixText? : string;
  }

  export interface MenuItem {
    label?     : string;
    icon?      : string;
    disabled?  : boolean;
    separator? : boolean;
    command?   : PrimeMenuItem['command'];
    url?       : PrimeMenuItem['url'];
    target?    : PrimeMenuItem['target'];
    items?     : MenuItem[];
  }

  export interface MenuExposes {
    toggle   : (event: Event) => void;
    menuId   : string;
    expanded : ComputedGetter<boolean>;
  }
</script>


<script setup lang="ts">
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import PrimeMenu, { type MenuMethods as PrimeMenuMethods } from 'primevue/menu';
  import { computed, ref, useAttrs, useId, useSlots } from 'vue';
  import { useReseeBreakpoints } from '../composables/use-resee-breakpoints';
  import { blockBodyScroll } from '../utils/dom';
  import IconTextPair from './IconTextPair.vue';
  import { TeleportId } from '../constants';

  defineOptions({
    inheritAttrs: false,
  });

  const attrs   = useAttrs();
  const slots   = useSlots();
  const menuId  = useId();
  const menu    = ref<PrimeMenuMethods>();
  const visible = ref(false);
  const isSmall = useReseeBreakpoints().smallerOrEqual('sm');

  const props = withDefaults(
    defineProps<MenuProps>(),
    {
      prefixText : undefined,
      suffixText : undefined,
    },
  );

  defineExpose<MenuExposes>({
    toggle   : (event: Event) => menu.value?.toggle(event),
    expanded : () => visible.value,
    menuId   : menuId,
  });

  let unblockScroll: (() => void) | undefined = undefined;

  const passthroughProps = computed(() => {
    return {
      start : { class: 'menu-prefix' },
      end   : { class: 'menu-suffix' },
      list  : { class: 'menu-list' },

      transition: {
        name: isSmall.value ? 'slide-in-bottom' : 'fade',

        onBeforeEnter() {
          visible.value = true;

          if (isSmall.value) {
            unblockScroll = blockBodyScroll();
          }
        },

        onAfterLeave() {
          visible.value = false;
          unblockScroll?.();
          unblockScroll = undefined;
        },
      },
    };
  });
</script>
