<template>
  <div class="distribution-tab">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Loading skeleton cards -->
      <template v-if="isLoading">
        <Card v-for="i in 4" :key="`skeleton-${i}`">
          <template #header>
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-2">
                <Skeleton shape="circle" size="2.5rem" />
                <Skeleton height="1.5rem" width="8rem" />
              </div>
              <div class="flex items-center gap-2">
                <Skeleton height="1.5rem" width="6rem" />
              </div>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-4 gap-4">
              <div class="col-span-2 flex items-center justify-center">
                <Skeleton shape="circle" size="12rem" />
              </div>
              <div class="flex flex-col gap-2 bg-gray-100 p-6 rounded-lg h-full col-span-2">
                <Skeleton v-for="j in 5" :key="j" height="1.5rem" class="mb-2" />
              </div>
            </div>
          </template>
        </Card>
      </template>

      <!-- Actual data cards -->
      <template v-else-if="distributions && distributions.length > 0">
        <template v-for="(distribution, idx) in chartData" :key="idx">
          <Card>
            <template #header>
              <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-2">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full"
                    :class="getBadgeClass(distribution.statisticType)"
                  >
                    <i :class="getBadgeIcon(distribution.statisticType)" class="text-white"></i>
                  </div>
                  <span class="font-semibold text-lg">{{ getBadgeTitle(distribution.statisticType) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-medium">Total Time:</span>
                  <span class="font-semibold">{{ distribution.time }}</span>
                </div>
              </div>
            </template>
            <template #content>
              <template v-if="distribution.applications?.length">
                <div class="grid grid-cols-4 gap-4">
                  <Chart
                    type="doughnut"
                    :data="distribution.chart"
                    :options="chartOptions"
                    class="w-full col-span-2"
                  />
                  <div class="flex flex-col gap-2 bg-gray-100 p-6 rounded-lg h-full col-span-2">
                    <template v-for="(application, appIdx) in distribution.applications" :key="appIdx">
                      <div class="flex gap-2 justify-between">
                        <span class="font-medium">{{ application.title }}</span>
                        <span>{{ application.time }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
              <div v-else class="flex flex-col items-center gap-8 py-8">
                <img src="@/assets/images/noData.svg" alt="No Data" />
                <span class="text-gray-500">No Data Available</span>
              </div>
            </template>
          </Card>
        </template>
      </template>
    </div>

    <!-- Empty state (only when not loading and no data) -->
    <div v-if="!isLoading && (!distributions || distributions.length === 0)" class="flex flex-col items-center gap-8 py-8">
      <img src="@/assets/images/noData.svg" alt="No Data" />
      <span class="text-gray-500">No distribution data available.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Skeleton from 'primevue/skeleton';
import type { IDistribution } from '../../types';

interface IProps {
  distributions?: IDistribution[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  distributions: () => [],
  isLoading: false,
});

// Transform chart data for each distribution
const chartData = computed(() => {
  return props.distributions?.map((distribution) => {
    return {
      ...distribution,
      applications: distribution.Applications,
      chart: transformDataToChartFormat(distribution.Chart),
    };
  });
});

// Transform raw data to chart format with colors
const transformDataToChartFormat = (rawData: any[]) => {
  const colors = [
    '#06b6d4',
    '#FFC165',
    '#6b7280',
    '#10b981',
    '#f472b6',
    '#facc15',
    '#8b5cf6',
    '#ef4444',
    '#14b8a6',
  ];

  const hoverColors = [
    '#22d3ee',
    '#FFD580',
    '#9ca3af',
    '#34d399',
    '#fb7185',
    '#fde047',
    '#c4b5fd',
    '#f87171',
    '#2dd4bf',
  ];

  const labels = rawData.map((item) => item.label);
  const data = rawData.map((item) => item.value);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, rawData.length),
        hoverBackgroundColor: hoverColors.slice(0, rawData.length),
      },
    ],
  };
};

// Chart options with usePointStyle
const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
});

// Badge helper functions
function getBadgeClass(statisticType: string): string {
  const mapping: Record<string, string> = {
    work: 'bg-green-500',
    meeting: 'bg-yellow-500',
    leisure: 'bg-red-500',
    unclassified: 'bg-gray-500',
  };
  return mapping[statisticType.toLowerCase()] || 'bg-blue-500';
}

function getBadgeIcon(statisticType: string): string {
  const mapping: Record<string, string> = {
    work: 'pi pi-wrench',
    meeting: 'pi pi-crown',
    leisure: 'pi pi-calendar-clock',
    unclassified: 'pi pi-question',
  };
  return mapping[statisticType.toLowerCase()] || 'pi pi-chart-bar';
}

function getBadgeTitle(statisticType: string): string {
  const mapping: Record<string, string> = {
    work: 'Work',
    meeting: 'Meeting',
    leisure: 'Leisure',
    unclassified: 'Unclassified',
  };
  return mapping[statisticType.toLowerCase()] || statisticType;
}
</script>
