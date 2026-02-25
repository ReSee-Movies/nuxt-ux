<template>
  <ImageBackdrop
    :src                 = "currentSlide?.backdropSrc"
    :class               = "['hero-banner', { carousel: isCarousel }]"
    mask-preset          = "image-mask-hero"
    :scale-to-foreground = "true"
    :role                = "isCarousel ? 'region' : undefined"
  >
    <LayoutPageColumn :aria-live = "isCarousel ? ( props.autoplay ? 'off' : 'polite' ) : undefined">
      <div
        :class="{
          'flex flex-col justify-center' : isCarousel,
          'h-100 sm:h-112.5 md:h-120.5'  : isCarousel,
          'pt-8 pb-10 md:pt-16 md:pb-18' : !isCarousel,
        }"
      >
        <Transition :name="`slide-${ slideDir }`" mode="out-in">
          <div
            class                 = "md:w-3/4"
            :key                  = "slideIdx"
            :role                 = "isCarousel ? 'group' : undefined"
            :aria-roledescription = "isCarousel ? 'Slideshow' : undefined"
            :aria-label           = "isCarousel ? `Slide ${ slideIdx }: ${ currentSlide?.headlineText }` : undefined"
          >
            <Heading
              v-if  = "currentSlide?.headlineText || slots.headline"
              level = "1"
              class = "hero mb-2 md:mb-4 line-clamp-2 dark:text-shadow"
            >
              <slot name="headline" :slide="currentSlide">
                <span v-html="currentSlide?.headlineText" />
              </slot>
            </Heading>

            <Heading
              v-if  = "currentSlide?.subheadText || slots.subhead"
              level = "2"
              class = "mb-3 md:mb-5 text-balance line-clamp-2 dark:text-shadow"
            >
              <slot name="subhead" :slide="currentSlide">
                <span v-html="currentSlide?.subheadText" />
              </slot>
            </Heading>

            <p
              v-if  = "currentSlide?.introText || slots.intro"
              class = "p hero text-balance line-clamp-2 dark:text-shadow"
            >
              <slot name="intro" :slide="currentSlide">
                <span v-html="currentSlide?.introText" />
              </slot>
            </p>

            <div v-if="slots.actions" class="flex flex-col sm:flex-row gap-2 mt-6 md:gap-4 md:mt-10">
              <slot name="actions" :slide="currentSlide" />
            </div>
          </div>
        </Transition>
      </div>

      <div v-if="isCarousel" ref="navigation" class="slide-navigation">
        <ul>
          <li v-for="(slide, idx) of slides" :key="idx">
            <button
              v-prime-tooltip.top = "{ value: stripHtml(slide.headlineText ?? ''), showDelay: 250 }"
              :aria-label         = "slide.headlineText"
              :tabindex           = "slideIdx === idx ? '0' : '-1'"
              :class              = "{ 'active': slideIdx === idx }"
              @click              = "() => goToSlide(idx)"
            />
          </li>
        </ul>
      </div>
    </LayoutPageColumn>
  </ImageBackdrop>
</template>


<script lang="ts">
  import type { ImageBackdropProps } from './ImageBackdrop.vue';

  export type HeroBannerSingleItemProps = {
    backdropSrc?  : ImageBackdropProps['src'];
    headlineText? : string;
    subheadText?  : string;
    introText?    : string;
  }

  export interface HeroBannerProps<
    S extends HeroBannerSingleItemProps = HeroBannerSingleItemProps,
  > extends HeroBannerSingleItemProps {
    carousel?      : S[];
    slideDuration? : number;
    autoplay?      : boolean;
  }
</script>


<script setup lang="ts" generic="S extends HeroBannerSingleItemProps">
  import { pluckObject } from '@resee-movies/utilities/objects/pluck-object';
  import vPrimeTooltip from 'primevue/tooltip';
  import { computed, ref, useSlots, watch } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { stripHtml } from '../utils/string';
  import Heading from './Heading.vue';
  import ImageBackdrop from './ImageBackdrop.vue';
  import LayoutPageColumn from './LayoutPageColumn.vue';

  const props = withDefaults(
    defineProps<HeroBannerProps<S>>(),
    {
      headlineText  : undefined,
      subheadText   : undefined,
      introText     : undefined,
      backdropSrc   : undefined,
      carousel      : undefined,
      slideDuration : 15000,
      autoplay      : true,
    },
  );

  const navigation = ref<HTMLDivElement>();
  const slots      = useSlots();
  const slideIdx   = ref(0);
  const slideDir   = ref<'ltr' | 'rtl'>('ltr');

  const slides = computed<HeroBannerSingleItemProps[]>(() => {
    return Array.isArray(props.carousel)
      ? props.carousel
      : [pluckObject(props, ['headlineText', 'subheadText', 'introText', 'backdropSrc'])];
  });

  const isCarousel = computed(() => {
    return slides.value.length > 1;
  });

  const currentSlide = computed(() => {
    return slides.value.at(slideIdx.value);
  });

  let timeoutId: NodeJS.Timeout | number | undefined = undefined;

  /**
   * Change to a specific slide via its index.
   */
  function goToSlide(idx: number, options?: { resetQueue?: boolean; computeTransitionDirection?: boolean }) {
    if (idx !== slideIdx.value && idx >= 0 && slides.value.length > idx) {
      const direction = options?.computeTransitionDirection !== false
        ? (slideIdx.value < idx ? 'ltr' : 'rtl')
        : 'ltr';

      slideIdx.value = idx;
      slideDir.value = direction;

      if (options?.resetQueue !== false) {
        resetSlideChangeQueue();
      }
    }
  }

  /**
   * Change to the next available slide, or loop back to the
   * first slide if at the end of the array.
   */
  function goToNextSlide() {
    const nextIdx = slideIdx.value + 1;

    slideIdx.value = slides.value.length <= nextIdx ? 0 : nextIdx;
    slideDir.value = 'rtl';
  }

  /**
   * Cancel the next slide change, if one is queued.
   */
  function cancelNextSlideChange() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  /**
   * Initiate a timeout that, when reached, will advance the component
   * to the next slide.
   */
  function queueNextSlideChange() {
    timeoutId = setTimeout(() => {
      goToNextSlide();
      queueNextSlideChange();
    }, props.slideDuration);
  }

  /**
   * Cancels the next slide change, if one is queued, and then queues a
   * new slide change if the component's conditions require.
   */
  function resetSlideChangeQueue() {
    cancelNextSlideChange();

    if (props.autoplay && isCarousel.value) {
      queueNextSlideChange();
    }
  }

  /**
   * Watches for changes to the component's autoplay prop, and whether there are
   * enough slides to warrant having the component behave like a carousel.
   */
  watch([isCarousel, () => props.autoplay], () => {
    resetSlideChangeQueue();

    if (!isCarousel.value) {
      goToSlide(0, { resetQueue: false, computeTransitionDirection: false });
    }
  }, { immediate: true });

  /**
   * Used by the navigation event listener to gather information about the state
   * of the navigation button bar.
   */
  function getActiveNavButton(target: EventTarget | null) {
    const result = {
      buttons : [] as HTMLButtonElement[],
      active  : -1,
    }

    if (!(target instanceof HTMLElement)) {
      return result;
    }

    let idx = 0;

    for (const button of target.querySelectorAll('button')) {
      result.buttons.push(button);

      if (button === document.activeElement) {
        result.active = idx;
      }

      idx += 1;
    }

    return result;
  }

  /**
   * Keyboard navigation support.
   */
  useEventListener(navigation, ['keyup'], (e: Event) => {
    if (e instanceof KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight": {
          const { buttons, active } = getActiveNavButton(e.currentTarget);

          if (active + 1 < buttons.length) {
            buttons.at(active + 1)?.focus();
          }

          break;
        }

        case "ArrowLeft": {
          const { buttons, active } = getActiveNavButton(e.currentTarget);

          if (active - 1 >= 0) {
            buttons.at(active - 1)?.focus();
          }

          break;
        }

        case "Home": {
          getActiveNavButton(e.currentTarget).buttons.at(0)?.focus();
          break;
        }

        case "End": {
          getActiveNavButton(e.currentTarget).buttons.at(-1)?.focus();
          break;
        }
      }
    }
  });
</script>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    .hero-banner {
      --fade-transition-duration: calc(var(--default-transition-duration) * 10);

      overflow         : clip;
      border-bottom    : solid 1px var(--color-global-foreground-accent);
      background-color : var(--color-global-background);

      &.carousel {
        /*
         * This is intentional. It's been noticed across browser that transitioning to/from
         * a translated state can cause subtle - but very annoying - visual glitching in
         * rendered text as properties like line-height are recomputed. Keeping them in this
         * state all the time avoids that.
         */
        h1, h2, p {
          transform: translateX(0.1px);
        }

        .slide-ltr-enter-from,
        .slide-ltr-leave-to,
        .slide-rtl-enter-from,
        .slide-rtl-leave-to {
          opacity: 0;
        }

        .slide-ltr-enter-active,
        .slide-ltr-leave-active,
        .slide-rtl-enter-active,
        .slide-rtl-leave-active {
          transition                 : opacity;
          transition-duration        : var(--fade-transition-duration);
          transition-timing-function : var(--default-transition-timing-function);

          h1, h2, p {
            transition                 : transform;
            transition-duration        : var(--fade-transition-duration);
            transition-timing-function : var(--default-transition-timing-function);
          }
        }

        .slide-ltr-leave-to,
        .slide-rtl-enter-from {
          h1 { transform: translateX(-1rem); }
          h2 { transform: translateX(-1.5rem);  }
          p  { transform: translateX(-0.4rem); }
        }

        .slide-ltr-enter-from,
        .slide-rtl-leave-to {
          h1 { transform: translateX(1rem); }
          h2 { transform: translateX(1.5rem); }
          p  { transform: translateX(0.4rem); }
        }
      }

      .slide-navigation {
        display         : flex;
        justify-content : center;

        ul {
          display          : flex;
          gap              : --spacing(2);
          align-items      : center;
          background-color : --alpha(var(--color-global-background) / 0.8);
          backdrop-filter  : blur(var(--blur-sm));
          padding          : --spacing(2);
          border-radius    : var(--radius-full);
          border           : solid 1px var(--color-global-background-accent);
        }

        button {
          --button-bg-color: var(--color-background-scale-g);

          display                    : block;
          padding                    : --spacing(1.25) --spacing(4);
          border-radius              : var(--radius-full);
          background-color           : var(--color-background-scale-g);
          border                     : solid 1px var(--color-background-scale-g);
          cursor                     : pointer;
          transition                 : background-color, border-color, box-shadow;
          transition-duration        : var(--default-transition-duration);
          transition-timing-function : var(--default-transition-timing-function);

          &.active {
            background-color : var(--button-bg-color);
            border-color     : var(--button-bg-color);
          }

          &:hover:not(.active), &:focus-visible, .highlighted {
            outline          : none;
            background-color : color-mix(in srgb-linear, var(--color-background-scale-g) 90%, var(--button-bg-color));
            border-color     : var(--button-bg-color);
          }
        }

        li:nth-child(1n) button { --button-bg-color: var(--color-resee-lite-red); }
        li:nth-child(2n) button { --button-bg-color: var(--color-resee-lite-orange); }
        li:nth-child(3n) button { --button-bg-color: var(--color-resee-lite-yellow); }
        li:nth-child(4n) button { --button-bg-color: var(--color-resee-lite-green); }
        li:nth-child(5n) button { --button-bg-color: var(--color-resee-lite-seaweed); }
        li:nth-child(6n) button { --button-bg-color: var(--color-resee-lite-aqua); }
        li:nth-child(7n) button { --button-bg-color: var(--color-resee-lite-blue); }
        li:nth-child(8n) button { --button-bg-color: var(--color-resee-lite-indigo); }
        li:nth-child(9n) button { --button-bg-color: var(--color-resee-lite-violet); }
      }
    }
  }
</style>
