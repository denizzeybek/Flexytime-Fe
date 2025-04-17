<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
    <template v-for="(item, idx) in badgeList" :key="idx">
      <SBadge class="" :severity="item.severity" :title="item.title" :value="item.value" :icon="item.icon"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import SBadge from './SBadge.vue';
import { computed } from 'vue';

const badgeList = computed(() => {
  return [
    { severity: 'success', title: 'Work', value: '04:58', icon: 'pi pi-wrench' },
    { severity: 'danger', title: 'Leisure', value: '04:58', icon: 'pi pi-calendar-clock' },
    { severity: 'warn', title: 'Meeting', value: '04:58', icon: 'pi pi-crown' },
    { severity: 'secondary', title: 'Unclassified', value: '04:58', icon: 'pi pi-question' },
    { severity: 'info', title: 'Start Time', value: '04:58', icon: 'pi pi-clock' },
    { severity: 'primary', title: 'End Time', value: '04:58', icon: 'pi pi-clock' },
  ];
});
</script>

<style scoped></style>
