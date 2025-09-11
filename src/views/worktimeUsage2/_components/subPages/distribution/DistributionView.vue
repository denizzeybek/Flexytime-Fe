<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <template v-for="(distribution, idx) in chartData" :key="idx">
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-2">
              <BadgeIcon
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
            <img src="@/assets/images/noData.svg" />
            <RText innerText="No Data Available" />
          </div>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Chart from 'primevue/chart';
import Card from 'primevue/card';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useBadge } from '../../../_composables/useBadge';
import { transformDataToChartFormat, getDoughnutChartOptions } from '../../../_utils/chartHelpers';
import BadgeIcon from '../../summary/BadgeIcon.vue';

const sectionsStore = useSectionsStore();
const { mapStatisticTypeToBadge } = useBadge();

const chartData = computed(() => {
  const distributions = sectionsStore.Distributions;
  return distributions
    ?.filter(distribution => distribution && distribution.statisticType) // Null check
    ?.map((distribution) => {
      return {
        ...distribution,
        applications: distribution.Applications || [],
        chart: transformDataToChartFormat(distribution.Chart),
      };
    });
});

const chartOptions = computed(() => getDoughnutChartOptions());
</script>