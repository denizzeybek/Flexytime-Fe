<template>
  <Card class="shadow-md border border-gray-100 rounded-xl">
    <template #header>
      <div class="w-full flex items-center justify-between flex-wrap px-5 pt-5">
        <section id="summary" class="flex gap-5 flex-col lg:flex-row">
          <div v-for="(item, idx) in summary" :key="idx" class="flex items-center gap-2">
            <FText class="text-gray-600">{{ item.label }}</FText>
            <FText as="h6" class="font-semibold">{{ item.value }}</FText>
          </div>
        </section>
        <Button icon="pi pi-download" severity="secondary" outlined class="shadow-sm" />
      </div>
    </template>
    <template #content>
      <div class="flex justify-center items-center !w-full">
        <FText class="-rotate-90">{{ unitText }}</FText>
        <Chart :type="EChartType.BAR" :data="chartData" :options="chartOptions" class="flex-1 !w-full" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { EChartType } from '@/enums/chartType.enum';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';

const { t } = useI18n<{ message: MessageSchema }>();
const reportsStore = useCompanyReportsStore();

const chartData = computed(() => {
  const graphData = reportsStore?.graphs;
  return {
    labels: graphData?.Main?.labels ?? [],
    datasets:
      graphData?.Main?.datasets?.map((dataset) => ({
        label: dataset.label ?? '',
        data: dataset.data ?? [],
        backgroundColor: dataset.backgroundColor ?? '',
        borderColor: dataset.borderColor ?? '',
      })) ?? [],
  };
});

const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: reportsStore?.graphs?.Main?.Unit || '',
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
        },
      },
    },
  };
});

const unitText = computed(() => reportsStore?.graphs?.Main?.Unit);

const summary = computed(() => {
  const summaryData = reportsStore?.summary;
  return [
    {
      label: t('components.reports.summary.total'),
      value: summaryData?.Total,
    },
    {
      label: t('components.reports.summary.billable'),
      value: summaryData?.Billable,
    },
    {
      label: t('components.reports.summary.unbillable'),
      value: summaryData?.Unbillable,
    },
  ];
});

const fetchInitialData = async () => {
  await reportsStore.queryReport({});
};

onMounted(() => {
  fetchInitialData();
});
</script>

<style scoped></style>
