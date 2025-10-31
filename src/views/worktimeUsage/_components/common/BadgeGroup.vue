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
import { useI18n } from 'vue-i18n';
import { type MessageSchema } from '@/plugins/i18n';
import SummaryBadge from './SummaryBadge.vue';
import type { ISummary } from '../../_types';

const { t } = useI18n<{ message: MessageSchema }>();

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
      title: t('components.badges.statisticType.work'),
      icon: 'pi pi-wrench',
    },
    meeting: {
      severity: 'warn',
      title: t('components.badges.statisticType.meeting'),
      icon: 'pi pi-crown',
    },
    leisure: {
      severity: 'danger',
      title: t('components.badges.statisticType.leisure'),
      icon: 'pi pi-calendar-clock',
    },
    unclassified: {
      severity: 'secondary',
      title: t('components.badges.statisticType.unclassified'),
      icon: 'pi pi-question',
    },
    starttime: {
      severity: 'info',
      title: t('components.badges.statisticType.startTime'),
      icon: 'pi pi-clock',
    },
    endtime: {
      severity: 'primary',
      title: t('components.badges.statisticType.endTime'),
      icon: 'pi pi-clock',
    },
  };

  const base = mapping[statisticType.toLowerCase()];
  if (!base) return null;

  return { ...base, value };
};
</script>
