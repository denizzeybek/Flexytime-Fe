<template>
  <div class="graph-tab">
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>
    <div v-else-if="chartData" class="card">
      <Chart :type="EChartType.BAR" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
    <NoDataState v-else :message="$t('components.graph.noDataAvailable')" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Chart from 'primevue/chart';
import ProgressSpinner from 'primevue/progressspinner';

import NoDataState from '@/components/common/NoDataState.vue';
import { getDayIndex } from '@/constants/dayOrder';
import { EChartType } from '@/enums/chartType.enum';

import type { IGraph } from '../../_types';
import type { ClockGraph, ClockGraphGroup } from '@/client';

interface IProps {
  graphs?: IGraph | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  graphs: null,
  isLoading: false,
});

// Type guard to check if graphs is ClockGraphGroup (has Summary property)
const isClockGraphGroup = (graph: IGraph): graph is ClockGraphGroup => {
  return 'Summary' in graph;
};

// Transform chart data
const chartData = computed(() => {
  if (!props.graphs) return null;

  // Check if it's ClockGraphGroup type (has Summary property)
  if (!isClockGraphGroup(props.graphs)) return null;

  // Summary ve datasets kontrolü
  if (!props.graphs.Summary?.datasets?.length || !props.graphs.Summary?.labels?.length) {
    return null;
  }

  return setChartData(props.graphs.Summary);
});

// Chart options with stacking and custom styling
const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          padding: 15,
          font: {
            size: 13,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
          font: { weight: 500 },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: props.graphs && isClockGraphGroup(props.graphs) ? props.graphs.Summary?.Unit || '' : '',
          color: textColorSecondary,
          font: {
            size: 12,
            weight: 500,
          },
        },
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
});

// Color palette matching SummaryBadge severity colors
const getColorForLabel = (label: string): { bg: string; border: string } => {
  const normalizedLabel = label?.toLowerCase() || '';

  // Colors matching SummaryBadge component (same as project design)
  const colorMap: Record<string, { bg: string; border: string }> = {
    work: { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' }, // 🟢 Green-500 (success)
    meeting: { bg: 'rgba(249, 115, 22, 0.8)', border: 'rgb(249, 115, 22)' }, // 🟠 Orange-500 (warn)
    leisure: { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' }, // 🔴 Red-500 (danger)
    unclassified: { bg: 'rgba(100, 116, 139, 0.8)', border: 'rgb(100, 116, 139)' }, // ⚪ Slate-500 (secondary)
    // Turkish labels
    çalışma: { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' }, // 🟢 Green-500
    toplantı: { bg: 'rgba(249, 115, 22, 0.8)', border: 'rgb(249, 115, 22)' }, // 🟠 Orange-500
    'boş zaman': { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' }, // 🔴 Red-500
    'tasnif dışı': { bg: 'rgba(100, 116, 139, 0.8)', border: 'rgb(100, 116, 139)' }, // ⚪ Slate-500
  };

  // Direct match first
  if (colorMap[normalizedLabel]) {
    return colorMap[normalizedLabel];
  }

  // Partial match for flexibility
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalizedLabel.includes(key)) {
      return value;
    }
  }

  // Default fallback color
  return { bg: 'rgba(100, 116, 139, 0.8)', border: 'rgb(100, 116, 139)' }; // Slate-500
};

// Sort chart data by day order (Monday first)
const sortChartDataByDayOrder = (source: ClockGraph | undefined): ClockGraph | undefined => {
  if (!source?.labels?.length || !source?.datasets?.length) return source;

  // Create array of indices sorted by day order
  const indexedLabels = source.labels.map((label, index) => ({
    label,
    index,
    dayOrder: getDayIndex(label),
  }));

  // Sort by day order (Monday = 0 first)
  indexedLabels.sort((a, b) => {
    // If both have valid day orders, sort by day order
    if (a.dayOrder !== -1 && b.dayOrder !== -1) {
      return a.dayOrder - b.dayOrder;
    }
    // Keep original order for unknown labels
    return a.index - b.index;
  });

  // Reorder labels
  const sortedLabels = indexedLabels.map((item) => item.label);

  // Reorder each dataset's data array
  const sortedDatasets = source.datasets.map((ds) => ({
    ...ds,
    data: indexedLabels.map((item) => ds.data?.[item.index] ?? 0),
  }));

  return {
    ...source,
    labels: sortedLabels,
    datasets: sortedDatasets,
  };
};

// Set chart data with proper formatting - always use vibrant colors
const setChartData = (source: ClockGraph | undefined) => {
  const sortedSource = sortChartDataByDayOrder(source);

  return {
    labels: sortedSource?.labels,
    datasets: sortedSource?.datasets?.map((ds) => {
      const colors = getColorForLabel(ds.label || '');

      return {
        ...ds,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: ds.borderWidth || 2,
      };
    }),
  };
};
</script>
