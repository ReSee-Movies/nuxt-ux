<template>
  <UiLayoutPageColumn layout="vista">
    <UiLayoutPageContainer>
      <div>
        Here is some text before
        <UiIconTextPair v-once text="Hello World" icon="i-ph-chart-bar" trailing-icon="i-ph-lego-smiley" />
        and here is some text after.
      </div>

      <div class="flex flex-col gap-4">
        <div class="size-96" style="background-image: linear-gradient(to right, var(--colorscale-resee-linear))" />

        <div class="size-96" style="background-image: linear-gradient(to right, var(--colorscale-resee-linear-step))" />

        <div class="size-96" style="background-image: conic-gradient(var(--colorscale-resee-conic))" />

        <div class="size-96" style="background-image: conic-gradient(var(--colorscale-resee-conic-step))" />
      </div>
    </UiLayoutPageContainer>
  </UiLayoutPageColumn>
</template>
