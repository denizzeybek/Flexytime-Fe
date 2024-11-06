<template>
  <Card>
    <template #header>
      <div class="w-full flex items-center justify-between flex-wrap px-5 pt-5">
        <section id="summary" class="flex gap-4 flex-col lg:flex-row">
          <div v-for="(item, idx) in summary" :key="idx" class="flex items-center gap-2">
            <FText>{{ item.label }}</FText>
            <FText as="h6">{{ item.value }}</FText>
          </div>
        </section>
        <Button icon="pi pi-download" severity="secondary" outlined />
      </div>
    </template>
    <template #content>
      <div class="flex justify-center items-center !w-full">
        <FText class="-rotate-90">{{ unitText }}</FText>
        <Chart type="bar" :data="chartData" :options="chartOptions" class="flex-1 !w-full" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCompanyReportsStore } from '@/stores/company/reports';
import type { IReportDataset } from '@/interfaces/company/report';

const reportsStore = useCompanyReportsStore();

const chartData = computed(() => {
  const graphData = reportsStore?.graphs;
  return {
    labels: graphData?.Main?.labels,
    datasets: graphData?.Main?.datasets.map((dataset: IReportDataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.borderColor,
    })),
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
      label: 'Total',
      value: summaryData?.Total,
    },
    {
      label: 'Billable',
      value: summaryData?.Billable,
    },
    {
      label: 'Unbillable',
      value: summaryData?.Unbillable,
    },
  ];
});

const fetchInitialData = async () => {
  await reportsStore.fetchElasticReportQuery();
};

onMounted(() => {
  fetchInitialData();
});
</script>

<style scoped></style>
