<template>
  <h1>&ltUiMessage /&gt;</h1>

  <div class="grid md:grid-cols-2 gap-4">
    <template v-for="item of [undefined, 'inverted', 'info', 'help', 'success', 'warn', 'error']">
      <div>
        <UiMessage
          :severity = "item"
          :text     = "`Message box type: ${ item ?? 'plain' }`"
          :closable = "true" />
      </div>

      <div>
        <UiMessage
          :severity = "item"
          :text     = "`Message box type: ${ item ?? 'plain' } accent`"
          :closable = "true"
          :accented = "true"
        />
      </div>
    </template>
  </div>
</template>
