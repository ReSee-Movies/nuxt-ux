<template>
  <h1>&ltUiCard /&gt;</h1>

  <div class="grid grid-cols-3">
    <UiCard interactive>
      <template #content>
        <UiLorem type="sentences" min="5" />
      </template>
    </UiCard>
  </div>
</template>
