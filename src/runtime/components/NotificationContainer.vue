<template>
  <PrimeToast :pt="passthroughProps">
    <template #messageicon="iconProps">
      <span v-bind="iconProps" />
    </template>
  </PrimeToast>
</template>

<script setup lang="ts">
  import { isString } from '@resee-movies/utilities/strings/is-string';
  import PrimeToast, { type ToastPassThroughOptions } from 'primevue/toast';
  import { StatusLevelIcons } from '../constants';

  const passthroughProps: ToastPassThroughOptions = {
    message: ({ props }) => ({
      class: [
        'notification',
        'status-indicating-accent',
        'shadow-heavy',
        props.message?.severity,
        props.message?.summary?.trim() ? 'has-summary' : undefined,
      ],
    }),

    messageIcon: ({ props }) => {
      let iconClassName = StatusLevelIcons[props.message?.severity ?? 'default'];

      if (props.message && 'icon' in props.message && isString(props.message.icon)) {
        iconClassName = props.message.icon;
      }

      console.log(iconClassName);

      return {
        class: ['icon', iconClassName],
      };
    },

    root            : { class: 'notification-container' },
    messageContent  : { class: 'content' },
    messageText     : { class: 'text' },
    summary         : { class: 'headline' },
    detail          : { class: 'text-detail' },
    buttonContainer : { class: 'close-wrapper' },
    closeButton     : { class: 'close' },
    transition      : { name:'fade', appear: true },
  };
</script>

<style>
  @reference "tailwindcss";

  @layer components {
    .notification-container > div {
      display        : flex;
      flex-direction : column;
      gap            : --spacing(2);

      /* The magic number 40px is 2x the inset value that Primevue applies. */
      width: min(calc(100vw - 40px), --spacing(92));


      .notification .content {
        display     : flex;
        align-items : center;
        gap         : --spacing(2.5);
        padding     : --spacing(2) --spacing(2.5);
      }

      .notification .icon {
        flex-shrink : 0;
        font-size   : 1.25rem;
      }

      .notification.has-summary .icon {
        align-self : start;
        margin-top : --spacing(0.25);
      }

      .notification .text {
        flex-grow: 1;
      }

      .notification .close-wrapper {
        align-self: start;
      }
    }
  }
</style>
