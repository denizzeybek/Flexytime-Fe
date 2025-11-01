<template>
  <div class="graph-tab">
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>
    <div v-else-if="chartData" class="card">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
    <div v-else class="text-center text-gray-500 p-8">
      <p>{{ $t('components.graph.noDataAvailable') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { type MessageSchema } from '@/plugins/i18n';
import Chart from 'primevue/chart';
import ProgressSpinner from 'primevue/progressspinner';
import type { IGraph } from '../../_types';

const { t } = useI18n<{ message: MessageSchema }>();

interface IProps {
  graphs?: IGraph | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  graphs: null,
  isLoading: false,
});

// Transform chart data
const chartData = computed(() => {
  if (!props.graphs) return null;

  // Summary ve datasets kontrolü
  if (!props.graphs.Summary?.datasets?.length || !props.graphs.Summary?.labels?.length) {
    return null;
  }

  return setChartData(props.graphs.Summary);
});

// Set chart data with proper formatting
const setChartData = (source: IGraph['Summary']) => {
  return {
    labels: source?.labels,
    datasets: source?.datasets?.map((ds) => ({
      ...ds,
      backgroundColor: Array.isArray(ds.backgroundColor)
        ? ds.backgroundColor
        : ds.data?.map(() => ds.backgroundColor),
      borderColor: Array.isArray(ds.borderColor)
        ? ds.borderColor
        : ds.data?.map(() => ds.borderColor),
      borderWidth: ds.borderWidth || 1,
    })),
  };
};

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
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
          font: { weight: 500 }
        },
        grid: {
          display: false,
          drawBorder: false
        },
      },
      y: {
        stacked: true,
        ticks: { color: textColorSecondary },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        },
      },
    },
  };
});
</script>
