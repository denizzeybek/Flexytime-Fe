<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
    <template v-for="(badge, idx) in badgeList" :key="idx">
      <SummaryBadge
        :severity="badge.severity!"
        :title="badge.title!"
        :value="badge.value"
        :icon="badge.icon!"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import SummaryBadge from './SummaryBadge.vue';
import { computed } from 'vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useBadge } from '../../_composables/useBadge';
import type { BadgeData } from '../../_types';

const sectionsStore = useSectionsStore();
const { mapStatisticTypeToBadge } = useBadge();

const badgeList = computed<BadgeData[]>(() => {
  const summary = sectionsStore.Summary ?? [];
  return summary
    .map((summary) =>
      mapStatisticTypeToBadge(summary.statisticType, summary.time)
    )
    .filter((item): item is BadgeData => item !== null);
});
</script>