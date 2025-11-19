<template>
  <slot
    name      = "control"
    :toggle   = "(event: Event) => menu?.toggle(event)"
    :menu-id  = "menuId"
    :expanded = "visible"
  />

  <PrimeMenu
    ref    = "menu"
    v-bind = "attrs"
    :model = "props.model"
    :popup = "true"
    :id    = "menuId"
    class  = "menu"
    :pt    = "passthroughProps"
    @show  = "visible = true"
    @hide  = "visible = false"
  >
    <template v-if="slots.prefix || props.prefixText" #start>
      <slot name="prefix">
        {{ props.prefixText }}
      </slot>
    </template>

    <template #item="{ item }">
      <slot name="item">
        <IconTextPair
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
  import IconTextPair from './IconTextPair.vue';

  defineOptions({
    inheritAttrs: false,
  });

  const attrs   = useAttrs();
  const slots   = useSlots();
  const menuId  = useId();
  const menu    = ref<PrimeMenuMethods>();
  const visible = ref(false);

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

  const passthroughProps = computed(() => {
    return {
      start: {
        class: 'menu-prefix',
      },

      end: {
        class: 'menu-suffix',
      },

      transition: {
        name: 'fade',
      },
    };
  });
</script>


<style>
  @reference "tailwindcss";

  .menu {
    border           : solid 1px var(--color-global-background-accent);
    border-radius    : var(--radius-md);
    background-color : var(--color-global-background);
    box-shadow       : var(--shadow-heavy);
    margin-block     : --spacing(1);
    padding          : --spacing(1);
    max-width        : --spacing(80);

    li[role="separator"] {
      border-bottom : solid 1px var(--color-global-background-accent);
      margin-block  : --spacing(1);
    }

    /* Sublevel headings */
    li[role="none"] {
      user-select : none;
      padding     : --spacing(1) --spacing(2);
      font-weight : var(--font-weight-semibold);
    }

    li[role="menuitem"] {
      user-select         : none;
      cursor              : pointer;
      padding             : --spacing(1) --spacing(2);
      border-radius       : var(--radius-md);
      transition          : background-color;
      transition-duration : var(--default-transition-duration);

      &[data-p-focused="true"] {
        background-color: var(--color-background-scale-c);
      }

      &[aria-disabled="true"] {
        cursor : not-allowed;
        color  : var(--color-global-foreground-accent);

        &[data-p-focused="true"] {
          background-color: transparent;
        }
      }
    }

    .menu-prefix {
      padding       : 0 --spacing(2) --spacing(1);
      margin-bottom : --spacing(1);
      border-bottom : solid 1px var(--color-global-background-accent);
    }

    .menu-suffix {
      padding    : --spacing(1) --spacing(2) 0;
      margin-top : --spacing(1);
      border-top : solid 1px var(--color-global-background-accent);
    }
  }
</style>
