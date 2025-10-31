<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-3">
    <template v-for="(item, idx) in badgeList" :key="idx">
      <SummaryBadge
        :severity="item.severity"
        :title="item.title"
        :value="item.value"
        :icon="item.icon"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SummaryBadge from './SummaryBadge.vue';
import type { ISummary } from '../../_types';

interface IProps {
  summary?: ISummary[];
}

const props = withDefaults(defineProps<IProps>(), {
  summary: () => [],
});

interface IBadgeData {
  severity: string;
  title: string;
  icon: string;
  value: any;
}

const badgeList = computed<IBadgeData[]>(() => {
  return props.summary
    .map((item) => mapStatisticTypeToBadge(item.statisticType, item.time))
    .filter((item): item is IBadgeData => item !== null);
});

const mapStatisticTypeToBadge = (statisticType: string, value: any): IBadgeData | null => {
  const mapping: Record<string, Omit<IBadgeData, 'value'>> = {
    work: {
      severity: 'success',
      title: 'Work',
      icon: 'pi pi-wrench',
    },
    meeting: {
      severity: 'warn',
      title: 'Meeting',
      icon: 'pi pi-crown',
    },
    leisure: {
      severity: 'danger',
      title: 'Leisure',
      icon: 'pi pi-calendar-clock',
    },
    unclassified: {
      severity: 'secondary',
      title: 'Unclassified',
      icon: 'pi pi-question',
    },
    starttime: {
      severity: 'info',
      title: 'Start Time',
      icon: 'pi pi-clock',
    },
    endtime: {
      severity: 'primary',
      title: 'End Time',
      icon: 'pi pi-clock',
    },
  };

  const base = mapping[statisticType.toLowerCase()];
  if (!base) return null;

  return { ...base, value };
};
</script>
