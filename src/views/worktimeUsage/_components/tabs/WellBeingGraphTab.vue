<template>
  <div class="wellbeing-graph-tab">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>

    <!-- Data -->
    <div v-else-if="graphs && graphs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        v-for="(item, idx) in graphs"
        :key="idx"
        class="!bg-surface-primary dark:!bg-surface-secondary !border !border-border-secondary dark:!border-border-primary transition-colors"
      >
        <template #header>
          <div class="flex items-center gap-3 p-4">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500">
              <i :class="getIconClass(item.Icon)" class="text-white text-lg"></i>
            </div>
            <span class="font-semibold text-lg text-content-primary">{{ item.Name }}</span>
          </div>
        </template>
        <template #content>
          <Chart
            :type="EChartType.BAR"
            :data="transformChartData(item)"
            :options="getChartOptions(item)"
            class="h-64"
          />
        </template>
      </Card>
    </div>

    <!-- Empty -->
    <NoDataState v-else :message="$t('components.wellbeing.noWellbeingData')" />
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import ProgressSpinner from 'primevue/progressspinner';

import NoDataState from '@/components/common/NoDataState.vue';
import { EChartType } from '@/enums/chartType.enum';

import type { IWellBeingGraph } from '@/stores/worktimeUsage/worktimeStore';

interface IProps {
  graphs?: IWellBeingGraph[];
  isLoading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  graphs: () => [],
  isLoading: false,
});

const getIconClass = (icon?: string): string => {
  if (!icon) return 'pi pi-heart';
  const iconMap: Record<string, string> = {
    'fas fa-fire-extinguisher': 'pi pi-bolt',
    'fas fa-volume-slash': 'pi pi-volume-off',
    'fas fa-cogs': 'pi pi-cog',
    'fas fa-fast-forward': 'pi pi-forward',
    'fas fa-mail-bulk': 'pi pi-envelope',
    'fas fa-clock': 'pi pi-clock',
    'fas fa-coffee': 'pi pi-star',
    'fas fa-walking': 'pi pi-user',
  };
  return iconMap[icon] || 'pi pi-heart';
};

const transformChartData = (item: IWellBeingGraph) => ({
  labels: item.Graph.labels,
  datasets: item.Graph.datasets.map((ds) => ({
    ...ds,
    backgroundColor: 'rgba(249, 115, 22, 0.8)',
    borderColor: 'rgb(249, 115, 22)',
    borderWidth: 2,
    borderRadius: 4,
  })),
});

const getChartOptions = (item: IWellBeingGraph) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: { raw: number }) => `${context.raw} ${item.Graph.Unit || ''}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColorSecondary, font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: item.Graph.Unit || '',
          color: textColorSecondary,
          font: { size: 12, weight: 500 },
        },
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder },
      },
    },
  };
};
</script>
