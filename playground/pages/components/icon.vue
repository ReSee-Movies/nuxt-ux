<template>
  <div class="flex gap-4 items-center">
    <div><Icon name="i-ph-alien" size="sm" /></div>
    <div><Icon name="i-ph-alien" /></div>
    <div><Icon name="i-ph-alien" size="lg" /></div>
    <div><Icon name="i-ph-alien" size="xl" /></div>
  </div>

  <hr class="hr">

  <div class="flex">
    <div class="flex items-center justify-center w-24 h-24 mb-4 border border-global-background-accent">
      <IconTransition
        :name    = "currentIcon"
        :loading = "loading && display"
        class    = "bg-global-background-accent"
      />
    </div>

    <div class="flex items-center justify-center w-48 h-24 mb-4 border border-global-background-accent">
      <IconTextPair class="bg-global-background-accent" :icon="currentIcon">
        <template #leading="{ slotProps }">
          <IconTransition v-bind="slotProps" :loading="loading && display" />
        </template>

        <template #default>
          Hello World
        </template>
      </IconTextPair>
    </div>
  </div>

  <div class="flex gap-4">
    <Button text="Toggle Icon Name" @click="toggleIconName" />
    <Button text="Toggle Icon On/Off" @click="toggleIconOnOff" />
    <Button text="Toggle Loading" @click="toggleLoading" />
  </div>
</template>


<script setup lang="ts">
  import Button from '#resee-ux/components/Button.vue';
  import Icon from '#resee-ux/components/Icon.vue';
  import IconTransition from '#resee-ux/components/IconTransition.vue';
  import IconTextPair from '#resee-ux/components/IconTextPair.vue';
  import { ref } from 'vue';

  definePageMeta({
    heading: 'Icon',
  });

  const icons   = ['i-ph-alien', 'i-ph-rocket-launch'];
  const index   = ref(0);
  const display = ref(true);
  const loading = ref(false);

  const currentIcon = computed(() => {
    return display.value ? icons.at(index.value) : undefined;
  });

  function toggleIconName() {
    index.value = index.value > 0 ? 0 : 1;
  }

  function toggleIconOnOff() {
    display.value = !display.value;
  }

  function toggleLoading() {
    loading.value = !loading.value;
  }
</script>
