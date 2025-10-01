<template>
  <h1 class="h1 mb-4">&lt;UiButton /&gt;</h1>

  <div class="flex items-center gap-3 mb-4">
    <div>
      <UiButton
        icon       = "i-ph-chart-donut"
        aria-label = "A Donut Chart"
        tooltip    = "An icon-only button"
        @click     = "async () => await sleep(10000)"
      />
    </div>

    <div>
      <UiButton
        icon             = "i-ph-chart-donut"
        aria-label       = "A Donut Chart"
        :disabled        = "true"
        disabled-tooltip = "A disabled icon-only button"
      />
    </div>

    <div>
      <UiButton
        icon       = "i-ph-chart-donut"
        aria-label = "A Donut Chart"
        :bordered  = "false"
        tooltip    = "A borderless icon-only button"
      />
    </div>

    <div>
      <UiButton
        icon       = "i-ph-chart-donut"
        aria-label = "A Donut Chart"
        :loading   = "true"
        tooltip    = "A loading icon-only button"
      />
    </div>

    <div>
      <UiButton
        icon       = "i-ph-chart-donut"
        aria-label = "A Donut Chart"
        size       = "sm"
        tooltip    = "A small icon-only button"
      />
    </div>

    <div>
      <UiButton
        icon       = "i-ph-chart-donut"
        aria-label = "A Donut Chart"
        size       = "lg"
        tooltip    = "A large icon-only button"
      />
    </div>
  </div>

  <div class="flex items-center gap-3 mb-4">
    <div>
      <UiButton icon="i-ph-chart-donut" text="A Donut Chart" />
    </div>

    <div>
      <UiButton icon="i-ph-chart-donut" text="A Disabled Chart" disabled />
    </div>

    <div>
      <UiButton icon="i-ph-chart-donut" text="A Borderless Chart" :bordered="false" />
    </div>
  </div>

  <div class="mb-4">
    <UiButton icon="i-ph-chart-donut" text="A Responsive-Shrink Button" responsive="shrink" />
  </div>

  <div class="mb-4">
    <UiButton icon="i-ph-chart-donut" text="A Responsive-Grow Button" responsive="grow" />
  </div>

  <div>
    <UiButton icon="i-ph-chart-donut">
      Text in the default slot
    </UiButton>
  </div>
</template>

<script setup lang="ts">
  import { sleep } from '@resee-movies/utilities/timers/sleep';
</script>
