<template>
  <div
    v-if      = "!isDismissed"
    :class    = "['announcement', { dismissable: props.dismissable }]"
    role      = "alert"
    aria-live = "polite"
  >
    <LayoutPageColumn :class="{ 'relative': props.dismissable }">
      <slot />

      <CloseButton
        v-if   = "props.dismissable"
        class  = "absolute right-3 top-1/2 -translate-y-1/2"
        size   = "sm"
        @click = "dismissAnnouncement()"
      />
    </LayoutPageColumn>
  </div>
</template>


<script lang="ts">
  export interface GlobalHeaderAnnouncementProps {
    announcementId? : string;
    dismissable?    : boolean;
  }
</script>


<script setup lang="ts">
  import { computed, ref } from 'vue';
  import CloseButton from './CloseButton.vue';
  import LayoutPageColumn from './LayoutPageColumn.vue';
  import { useReseeUx } from '../composables/use-resee-ux';

  const props = withDefaults(
    defineProps<GlobalHeaderAnnouncementProps>(),
    {
      announcementId : undefined,
      dismissable    : true,
    },
  );

  const { preferences } = useReseeUx();
  const isLocallyDismissed = ref(false);

  const isDismissed = computed(() => {
    return isLocallyDismissed.value
      || (props.announcementId && preferences.value.dismissNotification === props.announcementId);
  });

  function dismissAnnouncement() {
    if (props.announcementId) {
      preferences.value.dismissNotification = props.announcementId;
    }

    isLocallyDismissed.value = true;
  }
</script>


<style scoped>
  @reference "tailwindcss";

  .announcement {
    --announcement-bg-color: white;

    position : relative;
    z-index  : 100;

    @variant dark {
      --announcement-bg-color: black;
    }

    background-image:
      linear-gradient(to bottom, var(--announcement-bg-color) 0 calc(100% - 10px), transparent),
      linear-gradient(to right, var(--colorscale-resee-linear));

    padding-bottom: 6px;

    &.dismissable > div {
      padding-right: --spacing(16);
    }
  }
</style>
