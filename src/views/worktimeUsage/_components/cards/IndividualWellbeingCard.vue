<template>
  <div class="individual-wellbeing-cards">
    <!-- Loading State -->
    <template v-if="isLoading">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card v-for="i in 4" :key="`skeleton-${i}`">
          <template #header>
            <div class="flex items-center gap-3 p-4 border-b">
              <Skeleton shape="circle" size="2.5rem" />
              <Skeleton height="1.5rem" width="10rem" />
            </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4">
              <Skeleton height="3rem" />
              <Skeleton height="2rem" />
              <Skeleton height="10rem" />
            </div>
          </template>
        </Card>
      </div>
    </template>

    <!-- Actual Data -->
    <template v-else-if="wellbeings && wellbeings.length > 0">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card v-for="(item, idx) in wellbeings" :key="idx" class="overflow-hidden">
          <template #header>
            <div class="flex items-center gap-3 p-4" :class="getHeaderBgClass(item.Color)">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-full"
                :class="getIconBgClass(item.Color)"
              >
                <i :class="getIconClass(item.Icon)" class="text-white text-lg"></i>
              </div>
              <span class="font-semibold text-lg" :class="getTextClass(item.Color)">
                {{ item.Name }}
              </span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4">
              <!-- Description -->
              <div class="flex items-start gap-2">
                <i class="pi pi-info-circle text-gray-400 mt-0.5"></i>
                <p class="text-gray-600 text-sm">{{ item.Description }}</p>
              </div>

              <!-- Suggestion -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex items-start gap-2">
                  <i class="pi pi-lightbulb text-amber-500 mt-0.5"></i>
                  <div>
                    <span class="text-xs font-medium text-gray-500 uppercase">
                      {{ t('components.wellbeing.suggestion') }}
                    </span>
                    <p class="text-gray-700 text-sm mt-1">{{ item.Suggestion }}</p>
                  </div>
                </div>
              </div>

              <!-- Chart -->
              <div v-if="item.Graph" class="mt-2">
                <Chart
                  :type="EChartType.BAR"
                  :data="transformChartData(item)"
                  :options="getChartOptions(item)"
                  class="h-48"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </template>

    <!-- Empty State -->
    <NoDataState v-else :message="t('components.wellbeing.noWellbeingData')" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Skeleton from 'primevue/skeleton';

import NoDataState from '@/components/common/NoDataState.vue';
import { EChartType } from '@/enums/chartType.enum';
import { type MessageSchema } from '@/plugins/i18n';

import type { IIndividualWellbeing } from '../../_types';

interface IProps {
  wellbeings?: IIndividualWellbeing[];
  isLoading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  wellbeings: () => [],
  isLoading: false,
});

const { t } = useI18n<{ message: MessageSchema }>();

// Color mappings based on SummaryBadge colors
const colorConfig = {
  red: {
    headerBg: 'bg-red-50',
    iconBg: 'bg-red-500',
    text: 'text-red-700',
    chartBg: 'rgba(239, 68, 68, 0.8)',
    chartBorder: 'rgb(239, 68, 68)',
  },
  yellow: {
    headerBg: 'bg-orange-50',
    iconBg: 'bg-orange-500',
    text: 'text-orange-700',
    chartBg: 'rgba(249, 115, 22, 0.8)',
    chartBorder: 'rgb(249, 115, 22)',
  },
  green: {
    headerBg: 'bg-green-50',
    iconBg: 'bg-green-500',
    text: 'text-green-700',
    chartBg: 'rgba(34, 197, 94, 0.8)',
    chartBorder: 'rgb(34, 197, 94)',
  },
};

const getHeaderBgClass = (color?: string): string => {
  if (!color) return 'bg-gray-50';
  return colorConfig[color as keyof typeof colorConfig]?.headerBg || 'bg-gray-50';
};

const getIconBgClass = (color?: string): string => {
  if (!color) return 'bg-gray-500';
  return colorConfig[color as keyof typeof colorConfig]?.iconBg || 'bg-gray-500';
};

const getTextClass = (color?: string): string => {
  if (!color) return 'text-gray-700';
  return colorConfig[color as keyof typeof colorConfig]?.text || 'text-gray-700';
};

// Convert FontAwesome icons to PrimeIcons
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

const transformChartData = (item: IIndividualWellbeing) => {
  const config = colorConfig[item.Color as keyof typeof colorConfig] || colorConfig.yellow;

  return {
    labels: item.Graph?.labels || [],
    datasets: (item.Graph?.datasets || []).map((ds) => ({
      ...ds,
      backgroundColor: config.chartBg,
      borderColor: config.chartBorder,
      borderWidth: 2,
      borderRadius: 4,
    })),
  };
};

const getChartOptions = (item: IIndividualWellbeing) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const unit = item.Graph?.Unit || '';
            return `${value} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>
