<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <template v-for="(distribution, idx) in chartData" :key="idx">
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-2">
              <SBadgeIcon
                v-bind="mapStatisticTypeToBadge(distribution.statisticType, distribution.time)!"
                class="w-fit"
                size="large"
              />
              <FText
                as="h6"
                :innerText="
                  mapStatisticTypeToBadge(distribution.statisticType, distribution.time)?.title
                "
              />
            </div>
            <div class="flex items-center gap-2">
              <FText as="h6" innerText="Total Time:" />
              <FText
                as="h6"
                :innerText="
                  mapStatisticTypeToBadge(distribution.statisticType, distribution.time)?.value
                "
              />
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
              <div class="flex flex-col gap-2 bg-f-light-gray p-6 rounded-lg h-full col-span-2">
                <template v-for="(application, idx) in distribution.applications" :key="idx">
                  <div class="flex gap-2 justify-between">
                    <RText as="h6" :innerText="application.title" />
                    <RText :innerText="application.time" />
                  </div>
                </template>
              </div>
            </div>
          </template>
          <div v-else class="flex flex-col items-center gap-8">
            <img src="@/assets/images/noData.svg"/>
            <RText innerText="No Data Available"/>
          </div>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Chart from 'primevue/chart';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import Card from 'primevue/card';
import { useStaticBadge } from '@/views/worktimeUsage/_composables/useStaticBadge';
import SBadgeIcon from '@/views/worktimeUsage/_components/summary/SBadgeIcon.vue';

const sectionsStore = useSectionsStore();
const { mapStatisticTypeToBadge } = useStaticBadge();

const chartData = computed(() => {
  const distributions = sectionsStore.Distributions;
  return distributions?.map((distribution) => {
    return {
      ...distribution,
      applications: distribution.Applications,
      chart: transformDataToChartFormat(distribution.Chart),
    };
  });
});

const transformDataToChartFormat = (rawData) => {
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
</script>
