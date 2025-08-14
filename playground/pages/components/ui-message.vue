<template>
  <h1>&ltUiMessage /&gt;</h1>

  <UiMessage text="This is a plain box" class="mb-2" closable />
  <UiMessage severity="info" icon="i-ph-chart-bar" class="mb-2">
    This is an info box. This is an info box. This is an info box. This is an info box. This is an info box.
    This is an info box. This is an info box. This is an info box. This is an info box. This is an info box.
  </UiMessage>
  <UiMessage severity="help" text="This is a help box" icon="i-ph-chart-bar" class="mb-2" closable />
  <UiMessage severity="success" text="This is a success box" class="mb-2" />
  <UiMessage severity="warn" text="This is a warn box" class="mb-2" />
  <UiMessage severity="error" text="This is an error box" />
</template>
