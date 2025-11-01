<template>
  <Card class="shadow-md border border-gray-100 rounded-xl">
    <template #header>
      <div class="flex gap-3 w-fit px-5 pt-5">
        <FSelect
          class="flex-1"
          name="group1"
          :placeholder="t('pages.company.reports.elasticPieChart.selectBillable')"
          :options="groupOptions"
        />

        <FSelect
          class="flex-1"
          name="group2"
          :placeholder="t('pages.company.reports.elasticPieChart.selectBillable')"
          :options="groupOptions"
        />
      </div>
    </template>
    <template #content>
      <div class="flex justify-between gap-12 flex-col lg:flex-row">
        <DataTable
          class="flex-1"
          :value="tableDataset"
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" />
        </DataTable>

        <Chart :type="EChartType.PIE" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useReport } from '@/views/company/_composables/useReport';
import { computed } from 'vue';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { EChartType } from '@/enums/chartType.enum';

const { t } = useI18n<{ message: MessageSchema }>();

interface IProps {
  group1Title: string;
  group2Title: string;
}

const props = defineProps<IProps>();

const { groupOptions } = useReport();
const reportsStore = useCompanyReportsStore();

const tableDataset = computed(() => {
  return reportsStore.grouping as any;
});

const columns = computed(() => {
  return [
    { field: 'Group1', header: props.group1Title },
    { field: 'Group2', header: props.group2Title },
    { field: 'Total', header: 'Total' },
  ];
});

const chartData = computed(() => {
  const groupData = reportsStore.graphs?.Group;
  const labels = groupData?.map((data) => data.label);
  const data = groupData?.map((data) => data.value);
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400'),
        ],
      },
    ],
  };
});

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

<style scoped></style>
