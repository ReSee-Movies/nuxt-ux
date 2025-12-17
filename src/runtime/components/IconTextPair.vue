<template>
  <span :class="['pair', props.spacing ? `spacing-${ props.spacing }` : undefined]">
    <slot
      name        = "leading"
      :slot-props = "{
        class : 'leading-icon',
        name  : props.icon,
        size  : props.iconSize,
      }"
    >
      <Icon
        v-if  = "props.icon"
        class = "leading-icon"
        :name = "props.icon"
        :size = "props.iconSize"
      />
    </slot>

    <span v-if="props.text || slots.default" class="label">
      <slot name="default">
        {{ props.text }}
      </slot>
    </span>

    <slot
      name        = "trailing"
      :slot-props = "{
        class : 'trailing-icon',
        name  : props.trailingIcon,
        size  : props.iconSize
      }"
    >
      <Icon
        v-if  = "props.trailingIcon"
        class = "trailing-icon"
        :name = "props.trailingIcon"
        :size = "props.iconSize"
      />
    </slot>
  </span>
</template>


<script lang="ts">
  import { useSlots } from 'vue';
  import type { IconProps } from './Icon.vue';

  export interface IconTextPairProps {
    text?             : string;
    icon?             : string;
    trailingIcon?     : string;
    iconSize?         : IconProps['size'];
    trailingIconSize? : IconProps['size'];
    spacing?          : 'wide' | 'normal' | 'none';
  }
</script>


<script setup lang="ts">
  import Icon from './Icon.vue';

  const props = withDefaults(
    defineProps<IconTextPairProps>(),
    {
      text             : undefined,
      icon             : undefined,
      trailingIcon     : undefined,
      iconSize         : undefined,
      trailingIconSize : undefined,
      layout           : undefined,
      spacing          : undefined,
    },
  );

  const slots = useSlots();
</script>

<style scoped>
  @reference "tailwindcss";

  @layer components {
    /**
     * We are intentionally targeting the immediate child of the icon component
     * to apply a margin to so that the icon can animated in/out via its size
     * and that extra bit of space included.
     */

    .pair {
      --element-spacing: --spacing(1);

      display     : inline;
      align-items : baseline;
    }

    .pair.spacing-none {
      --element-spacing: 0;
    }

    .pair.spacing-wide {
      --element-spacing: --spacing(2);
    }

    .pair :deep(.leading-icon) > * {
      margin-inline-end: var(--element-spacing);
    }

    .pair :deep(.trailing-icon) > * {
      margin-inline-start: var(--element-spacing);
    }

    @variant max-md {
      .pair:is(.responsive-shrink .pair) {
        &:deep(.leading-icon) > * {
          margin-inline-end: 0;
        }

        &:deep(.trailing-icon) > * {
          margin-inline-start: 0;
        }
      }
    }
  }
</style>
