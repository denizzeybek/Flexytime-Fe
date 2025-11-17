<template>
  <div class="grid gap-3" :class="gridColsClass">
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

import { ESeverity } from '@/enums/severity.enum';
import { EStatisticType } from '@/enums/statisticType.enum';
import { type MessageSchema } from '@/plugins/i18n';

import SummaryBadge from './SummaryBadge.vue';

import type { ISummary } from '../../_types';

interface IProps {
  summary?: ISummary[];
}

interface IBadgeData {
  severity: ESeverity;
  title: string;
  icon: string;
  value: any;
}

const props = withDefaults(defineProps<IProps>(), {
  summary: () => [],
});

const { t } = useI18n<{ message: MessageSchema }>();

const badgeList = computed<IBadgeData[]>(() => {
  return props.summary
    .map((item) => mapStatisticTypeToBadge(item.statisticType ?? '', item.time ?? ''))
    .filter((item): item is IBadgeData => item !== null);
});

// Dynamic grid columns based on badge count
const gridColsClass = computed(() => {
  const count = badgeList.value.length;

  // Mobile: always 2 columns
  // Desktop: match the number of badges (4 or 6)
  if (count === 4) {
    return 'grid-cols-2 lg:grid-cols-4';
  } else if (count === 6) {
    return 'grid-cols-2 lg:grid-cols-6';
  }

  // Fallback for other cases
  return 'grid-cols-2 lg:grid-cols-4';
});

const mapStatisticTypeToBadge = (statisticType: string, value: any): IBadgeData | null => {
  const mapping: Record<string, Omit<IBadgeData, 'value'>> = {
    [EStatisticType.WORK]: {
      severity: ESeverity.SUCCESS,
      title: t('components.badges.statisticType.work'),
      icon: 'pi pi-wrench',
    },
    [EStatisticType.MEETING]: {
      severity: ESeverity.WARN,
      title: t('components.badges.statisticType.meeting'),
      icon: 'pi pi-crown',
    },
    [EStatisticType.LEISURE]: {
      severity: ESeverity.DANGER,
      title: t('components.badges.statisticType.leisure'),
      icon: 'pi pi-calendar-clock',
    },
    [EStatisticType.UNCLASSIFIED]: {
      severity: ESeverity.SECONDARY,
      title: t('components.badges.statisticType.unclassified'),
      icon: 'pi pi-question',
    },
    [EStatisticType.START_TIME]: {
      severity: ESeverity.INFO,
      title: t('components.badges.statisticType.startTime'),
      icon: 'pi pi-clock',
    },
    [EStatisticType.END_TIME]: {
      severity: ESeverity.PRIMARY,
      title: t('components.badges.statisticType.endTime'),
      icon: 'pi pi-clock',
    },
  };

  const base = mapping[statisticType.toLowerCase()];
  if (!base) return null;

  return { ...base, value };
};
</script>
