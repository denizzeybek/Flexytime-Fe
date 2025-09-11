<template>
  <div class="card">
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Chart from 'primevue/chart';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { setChartData, getChartOptions } from '../../../_utils/chartHelpers';
import type { ChartInput } from '../../../_types';

const sectionsStore = useSectionsStore();

const mockData: ChartInput = {
  labels: [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  ],
  datasets: [
    {
      label: 'Unclassified',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(141, 163, 255, 0.3)',
      borderColor: '#EFF2FF',
    },
    {
      label: 'Leisure',
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 3.1, 0, 0, 1.4666666666666666, 2.6, 0, 2.8, 0,
        1.3333333333333333, 0, 0, 0, 0, 0, 0,
      ],
      backgroundColor: 'rgba(255, 62, 62, 0.3)',
      borderColor: '#FFECEC',
    },
    {
      label: 'Meeting',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(255, 181, 71, 0.3)',
      borderColor: '#FFF4E4',
    },
    {
      label: 'Work',
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 56.9, 60, 60, 58.53333333333333, 57.4, 60, 57.2, 60,
        58.666666666666664, 33.68333333333333, 59.21666666666667, 59.733333333333334, 46.5,
        59.88333333333333, 59.03333333333333,
      ],
      backgroundColor: 'rgba(48, 211, 94, 0.3)',
      borderColor: '#EBFBEF',
    },
  ],
  Unit: 'Dakika',
};

const chartData = computed(() => {
  // TODO: Replace with real data from store
  // const data = sectionsStore.Graphs;
  // return setChartData(data as ChartInput);
  return setChartData(mockData);
});

const chartOptions = computed(() => getChartOptions());
</script>