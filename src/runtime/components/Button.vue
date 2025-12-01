<template>
  <Component
    :is         = "props.is"
    :aria-label = "shrink ? props.text : undefined"
    :disabled   = "props.disabled"
    :class      = "[
      props.severity === 'unset' ? undefined : props.variant,
      {
        'borderless'        : !props.bordered,
        'small'             : props.size === 'sm',
        'large'             : props.size === 'lg',
        'disabled'          : props.disabled,
        'loading'           : showLoading,
        'responsive-shrink' : shrink,
        'responsive-grow'   : props.responsive === 'grow',
        'icon-only'         : iconOnly,
      },
    ]"
    v-prime-tooltip.top = "{ value: tooltipText, showDelay: 250 }"
    @click              = "handleButtonClick"
  >
    <IconTextPair
      :text                      = "props.text"
      :icon                      = "props.icon"
      :icon-size                 = "props.iconSize ?? props.size"
      :trailing-icon             = "props.trailingIcon"
      :layout                    = "props.layout"
      :spacing                   = "props.spacing ?? (props.layout === 'column' ? undefined : 'wide')"
      :loading                   = "showLoading"
      :icon-transition-name      = "props.iconTransitionName"
      :icon-transition-mode      = "props.iconTransitionMode"
      :icon-transition-on-appear = "props.iconTransitionOnAppear"
    >
      <slot />
    </IconTextPair>
  </Component>
</template>

<script lang="ts">
  import { toNonNullableArray } from '@resee-movies/utilities/arrays/to-non-nullable-array';
  import { isPromiseLike } from '@resee-movies/utilities/objects/is-promise-like';
  import { type Component, computed, ref, useSlots } from 'vue';
  import type { StyleStatusLevel } from '../types';
  import type { IconTextPairProps } from './IconTextPair.vue';

  /**
   * Button component properties.
   *
   * A note about the `responsive` prop:
   *
   * When a boolean true or "shrink", causes the button text to be hidden at the small
   * breakpoint, leaving only the icon. The text is still made reader accessible
   * via the aria-label attribute.
   *
   * When "grow", causes the button to expand to the full width of its container, and
   * increase its font size when at the small breakpoint.
   */
  export interface ButtonProps extends IconTextPairProps {
    is?              : string | Component;
    severity?        : StyleStatusLevel | 'unset';
    bordered?        : boolean;
    responsive?      : boolean | 'grow' | 'shrink';
    variant?         : 'btn' | 'a';
    size?            : 'sm' | 'lg';
    disabled?        : boolean;
    loading?         : boolean;
    tooltip?         : string;
    disabledTooltip? : string;
    onClick?         : ((evt: Event) => void | Promise<void>) | ((evt: Event) => void | Promise<void>)[];
  }
</script>

<script setup lang="ts">
  import vPrimeTooltip from 'primevue/tooltip';
  import IconTextPair from './IconTextPair.vue';

  defineEmits<{
    (e: 'click', evt: Event): (void | Promise<void>);
  }>();

  const props = withDefaults(
    defineProps<ButtonProps>(),
    {
      is              : 'button',
      severity        : undefined,
      bordered        : true,
      responsive      : false,
      variant         : 'btn',
      size            : undefined,
      disabled        : false,
      loading         : false,
      tooltip         : undefined,
      disabledTooltip : undefined,
    },
  );

  const slots = useSlots();

  const shrink   = computed(
    () => props.responsive === true || props.responsive === 'shrink',
  );

  const iconOnly = computed(
    () => !!(props.icon || props.trailingIcon) && !(props.text || slots.default),
  );

  const tooltipText = computed(
    () => props.disabled ? props.disabledTooltip : props.tooltip,
  );

  const pendingClickResult = ref(false);

  const showLoading = computed(
    () => props.loading || pendingClickResult.value,
  );

  async function handleButtonClick(evt: Event) {
    if (showLoading.value || props.disabled) {
      return;
    }

    if (props.onClick) {
      const handlers = toNonNullableArray(props.onClick);
      const results  = handlers.map((handler) => handler(evt));

      if (!!results.find((result) => isPromiseLike(result))) {
        pendingClickResult.value = true;
        await Promise.allSettled(results);
        pendingClickResult.value = false;
      }
    }
  }
</script>
