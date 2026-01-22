<template>
  <div :class="['tiler', props.maskPreset]">
    <div v-for="(entry, idx) of displayArray" :key="idx">
      <ImageBase
        :src     = "entry.source"
        aspect   = "poster"
        :class   = "[props.imageClass, { 'opacity-0': entry.switching || entry.loading }]"
        :style   = "{ '--duration': `${ entry.switchTime }ms`, '--delay': `${ entry.switchDelay }ms` }"
        @loading = "entry.loading = true"
        @load    = "entry.loading = false"
      />
    </div>
  </div>
</template>


<style scoped>
  @reference "tailwindcss";

  @layer components {
    .tiler {
      display               : grid;
      row-gap               : --spacing(v-bind(grid.gapX));
      column-gap            : --spacing(v-bind(grid.gapY));
      grid-template-columns : repeat(v-bind(grid.cols), 1fr);

      > div {
        justify-self: center;
      }
    }

    img {
      --duration : 200ms;
      --delay    : 0ms;

      transition                 : opacity;
      transition-duration        : var(--duration);
      transition-delay           : var(--delay);
      transition-timing-function : ease-out;
    }
  }
</style>


<script lang="ts">
  import type {
    ImageFileDescriptor,
    NormalizedFileDescriptor,
  } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import type { ShallowReactive } from 'vue';
  import type { BreakpointSettings } from '../composables/use-settings-for-breakpoint';
  import type { HTMLElementClassNames, ImageMaskPreset } from '../types';

  export type ValueOrRange = string | number | [min: number, max: number];

  export type ImageTilerGridSizeDefinition = {
    cols  : number;
    rows  : number;
    gap?  : number;
    gapX? : number;
    gapY? : number;
  };

  export const DefaultImageTilerGridSizeFallback = {
    cols : 5,
    rows : 4,
    gap  : 3,
  };

  export const DefaultImageTilerGridSizeDefinition: BreakpointSettings<ImageTilerGridSizeDefinition> = {
    md: {
      cols : 7,
      rows : 4,
    },

    lg: {
      cols : 10,
      rows : 4,
    },
  };

  export interface ImageTilerProps {
    images        : ImageFileDescriptor[];
    play?         : boolean;
    gridSettings? : BreakpointSettings<ImageTilerGridSizeDefinition>;
    turnoverRate? : ValueOrRange;
    switchTime?   : ValueOrRange;
    switchDelay?  : ValueOrRange;
    imageClass?   : HTMLElementClassNames;
    maskPreset?   : ImageMaskPreset | ImageMaskPreset[];
  }

  type ImageDisplayInfo = ShallowReactive<{
    source      : NormalizedFileDescriptor;
    loading     : boolean;
    switching   : boolean;
    switchTime  : number;
    switchDelay : number;
  }>;
</script>


<script setup lang="ts">
  import { useState } from '#imports';
  import { getRandomEntry } from '@resee-movies/utilities/arrays/get-random-entry';
  import { normalizeImageFileDescriptor } from '@resee-movies/utilities/images/normalize-image-file-descriptor';
  import { getRandomInteger } from '@resee-movies/utilities/numbers/get-random-integer';
  import { toInteger } from '@resee-movies/utilities/numbers/to-integer';
  import { sleep } from '@resee-movies/utilities/timers/sleep';
  import { computed, onMounted, shallowReactive, useId, watch } from 'vue';
  import { useSettingsForBreakpoint } from '../composables/use-settings-for-breakpoint';
  import ImageBase from './ImageBase.vue';


  const props = withDefaults(
    defineProps<ImageTilerProps>(),
    {
      play         : true,
      gridSettings : () => DefaultImageTilerGridSizeDefinition,
      turnoverRate : () => [2000, 6000],
      switchTime   : () => [1200, 1800],
      switchDelay  : () => [0, 500],
      imageClass   : undefined,
    },
  );


  const gridSettingsForBreakpoint = useSettingsForBreakpoint(() => props.gridSettings);

  /**
   * Row/Column/Gap configuration for the current breakpoint. Having this information
   * available also allows the component to be selective about what images show up next
   * to each other, as it can compute what is visually next to what.
   */
  const grid = computed(() => {
    const settings = gridSettingsForBreakpoint.value;

    const rows  = settings?.rows ?? DefaultImageTilerGridSizeFallback.rows;
    const cols  = settings?.cols ?? DefaultImageTilerGridSizeFallback.cols;
    const cells = rows * cols;
    const gapX  = settings?.gapX ?? settings?.gap ?? DefaultImageTilerGridSizeFallback.gap;
    const gapY  = settings?.gapY ?? settings?.gap ?? DefaultImageTilerGridSizeFallback.gap;

    return { rows, cols, cells, gapX, gapY };
  });

  const componentId  = useId();
  const displayArray = useState<ImageDisplayInfo[]>(componentId, () => {
    const arr: ImageDisplayInfo[] = [];

    for (let i = 0; i < grid.value.cells; i += 1) {
      arr.push(generateImageDisplayInfo(i, arr));
    }

    return arr;
  });

  /**
   * Image cells are initially rendered with their `switching` flag toggled true,
   * making them transparent. When mounted client-side, toggle those off, and being
   * the replacement loop.
   */
  onMounted(() => {
    showAll();
    queueNextChange();
  });

  /**
   * A watcher that is responsible for keeping the number of image cells in
   * step with the number requested.
   */
  watch(() => grid.value.cells, (newCount, oldCount) => {
    // Cell count has been reduced, drop entries.
    if (newCount < oldCount) {
      displayArray.value.splice(newCount, Number.POSITIVE_INFINITY);
      return;
    }

    // Cell count has been increased, add entries.
    if (newCount > oldCount) {
      while(displayArray.value.length < newCount) {
        const info = generateImageDisplayInfo(displayArray.value.length, displayArray.value);
        displayArray.value.push(info);
        showImageCellContent(info);
      }
    }
  });

  /**
   * Sets a timeout that, when reached, will pick a random image cell to change.
   * It then calls itself to set up for the change.
   */
  function queueNextChange() {
    setTimeout(async () => {
      if (props.play) {
        const idx  = getValueFromRange([0, displayArray.value.length - 1]);
        const info = displayArray.value[idx];

        if (info) {
          await switchImageCellContent(info, idx);
        }
      }

      queueNextChange();
    }, getValueFromRange(props.turnoverRate));
  }

  /**
   * Takes a `ValueOrRange`, and always returns a number. If a range is provided,
   * the returned number is randomly chosen from between the two bounds.
   */
  function getValueFromRange(value: ValueOrRange): number {
    return Array.isArray(value) ? getRandomInteger(value[0], value[1]) : toInteger(value);
  }

  /**
   * Selects a single image from those provided via the `images` prop. The selection is
   * random, but an attempt is made to not cluster images too closely together by looking
   * at what is currently in the `forArray` argument at and around its `forIdx` index.
   */
  function pickImage(forIdx: number, forArray: ImageDisplayInfo[]): NormalizedFileDescriptor {
    let candidate = normalizeImageFileDescriptor(getRandomEntry(props.images));

    if (props.images.length > 5) {
      const neighbors = getNeighborIndexes(
        forIdx,
        grid.value.cols,
        grid.value.rows,
        props.images.length > 9 ? '8-edge' : '4-edge',
      );

      neighbors.push(forIdx);

      for (let maxAttempts = 0; maxAttempts < 3; maxAttempts += 1) {
        if (isImageInUse(candidate, forArray, neighbors)) {
          candidate = normalizeImageFileDescriptor(getRandomEntry(props.images));
        }
        else {
          break;
        }
      }
    }

    return candidate;
  }


  /**
   * Given the size (columns/rows) of a 2d grid, and a specific target index within
   * that grid, this method will return the indices of the neighboring cells that
   * surround that target.
   *
   * The result is returned as an integer array, beginning with the value of the "top"
   * neighbor's index, and then proceeding clockwise around the target. A value of `-1`
   * indicates that no cell exists in that position - which will occur when the target
   * is on one of the boundaries of the grid.
   */
  function getNeighborIndexes(
    centerIdx   : number,
    columnCount : number,
    rowCount    : number,
    distance    : '4-edge' | '8-edge' = '8-edge',
  ): number[] {
    const rowOffset = Math.floor(centerIdx / columnCount);
    const colOffset = centerIdx % columnCount;

    const top    = (rowOffset > 0)           ? (centerIdx - columnCount) : -1;
    const right  = (colOffset < columnCount) ? (centerIdx + 1)           : -1;
    const bottom = (rowOffset < rowCount)    ? (centerIdx + columnCount) : -1;
    const left   = (colOffset > 0)           ? (centerIdx - 1)           : -1;

    if (distance === '4-edge') {
      return [top, right, bottom, left];
    }

    const topRight    = (top > -1 && right > -1)    ? (top + 1)    : -1;
    const bottomRight = (bottom > -1 && right > -1) ? (bottom + 1) : -1;
    const bottomLeft  = (bottom > -1 && left > -1)  ? (bottom - 1) : -1;
    const topLeft     = (top > -1 && left > -1)     ? (top - 1)    : -1;

    return [top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft];
  }


  /**
   * Checks the specified indices in `sourceArray` for the usage of the candidate
   * image.
   */
  function isImageInUse(
    candidate      : NormalizedFileDescriptor,
    sourceArray    : ImageDisplayInfo[],
    indicesToCheck : number[],
  ) {
    for (const idx of indicesToCheck) {
      if (idx < 0 || idx > sourceArray.length) {
        continue;
      }

      if (sourceArray.at(idx)?.source.identifier === candidate.identifier) {
        return true;
      }
    }

    return false;
  }


  /**
   * Creates a single reactive object that contains the info needed to display an image
   * cell. The `forIdx` and `forArray` arguments are passed along to {@link pickImage}.
   */
  function generateImageDisplayInfo(forIdx: number, forArray: ImageDisplayInfo[]): ImageDisplayInfo {
    return shallowReactive({
      source      : pickImage(forIdx, forArray),
      loading     : true,
      switching   : true,
      switchTime  : getValueFromRange(props.switchTime),
      switchDelay : getValueFromRange(props.switchDelay),
    });
  }

  /**
   * Sets a single image cell to "switching", causing it to appear hidden. The
   * returned promise resolves in the same amount of time as the transition duration
   * is configured to take.
   */
  async function hideImageCellContent(info: ImageDisplayInfo) {
    if (info.switching) {
      return;
    }

    info.switching = true;
    await sleep(info.switchTime + info.switchDelay);
  }

  /**
   * Removes the "switching" state from a single image cell, causing it to appear. The
   * returned promise resolves in the same amount of time as the transition duration is
   * configured to take.
   */
  async function showImageCellContent(info: ImageDisplayInfo) {
    if (!info.switching) {
      return;
    }

    info.switching = false;
    await sleep(info.switchTime + info.switchDelay);
  }

  /**
   * Runs through the steps of:
   *
   * 1. Hiding the image cell.
   * 2. Changing the image source.
   * 3. Displaying the image cell again.
   */
  async function switchImageCellContent(info: ImageDisplayInfo, idx: number) {
    await hideImageCellContent(info);
    info.source = pickImage(idx, displayArray.value);
    await showImageCellContent(info);
  }

  /**
   * Toggles the `switching` property of each image cell to false.
   */
  async function showAll() {
    return Promise.allSettled(
      displayArray.value.map(entry => showImageCellContent(entry)),
    );
  }

  /**
   * Toggles the `switching` property of each image cell to true.
   */
  async function hideAll() {
    return Promise.allSettled(
      displayArray.value.map(entry => hideImageCellContent(entry)),
    );
  }
</script>
