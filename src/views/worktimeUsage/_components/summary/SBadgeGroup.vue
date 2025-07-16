<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
    <template v-for="(item, idx) in badgeList" :key="idx">
      <SBadge
        :severity="item.severity!"
        :title="item.title!"
        :value="item.value"
        :icon="item.icon!"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import SBadge from './SBadge.vue';
import { computed } from 'vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useStaticBadge } from '@/views/worktimeUsage/_composables/useStaticBadge';
import type { BadgeData } from '@/views/worktimeUsage/_composables/useStaticBadge';

const sectionsStore = useSectionsStore();
const { mapStatisticTypeToBadge } = useStaticBadge();

const badgeList = computed<BadgeData[]>(() => {
  const summary = sectionsStore.Summary ?? [];
  return summary
    .map((summary) =>
      mapStatisticTypeToBadge(summary.statisticType, summary.time)
    )
    .filter((item): item is BadgeData => item !== null);
});
</script>

<style scoped></style>
