<template>
  <div class="grid md:grid-cols-2 gap-4">
    <template v-for="(item, idx) of messageTypes" :key="idx">
      <div>
        <UiMessage
          :severity = "item"
          :text     = "`Message box type: ${ item ?? 'plain' }`"
          :closable = "true"
        />
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


<script setup lang="ts">
  definePageMeta({
    heading: 'Message',
  });

  const messageTypes = [undefined, 'inverted', 'info', 'help', 'success', 'warn', 'error'] as const;
</script>
