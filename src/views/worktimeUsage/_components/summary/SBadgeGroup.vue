<template>
  <Card>
    <template #content>
      <div class="flex flex-wrap justify-between !gap-2">
        <template v-for="(item, idx) in badgeList" :key="idx">
          <SBadge class="" :severity="item.severity" :title="item.title" :value="item.value" />
        </template>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import SBadge from './SBadge.vue';
import { computed } from 'vue';

const badgeList = computed(() => {
  return [
    { severity: 'success', title: 'Work', value: '04:58' },
    { severity: 'danger', title: 'Leisure', value: '04:58' },
    { severity: 'warn', title: 'Meeting', value: '04:58' },
    { severity: 'secondary', title: 'Unclassified', value: '04:58' },
    { severity: 'info', title: 'Start Time', value: '04:58' },
    { severity: 'primary', title: 'End Time', value: '04:58' },
  ];
});
</script>

<style scoped></style>
