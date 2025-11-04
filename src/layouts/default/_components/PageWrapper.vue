<template>
  <div class="flex flex-col flex-1 lg:ml-[238px] p-4">
    <div id="alert" class="alert"></div>
    <section class="flex flex-col flex-1 h-full">
      <PageHeader class="mb-5 lg:mb-6" @drawerChange="emit('drawerChange', $event)" />
      <div class="flex-1">
        <slot></slot>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import PageHeader from './PageHeader.vue';

interface IEmits {
  (event: 'drawerChange', val: boolean): void;
}

const emit = defineEmits<IEmits>();
</script>
