<template>
  <div class="flex flex-col gap-6">
    <!-- Filters Form -->
    <Card class="shadow-md border border-gray-100 rounded-xl">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4 flex-wrap">
            <MultiSelect
              v-model="selectedTeams"
              :options="teamOptions"
              optionLabel="name"
              optionValue="value"
              :placeholder="t('pages.company.reports.elasticReports.filters.teams')"
              :maxSelectedLabels="2"
              class="flex-1 min-w-[180px]"
              filter
              :loading="reportsStore.isFiltersLoading"
              @change="onFilterChange"
            />
            <MultiSelect
              v-model="selectedEmployees"
              :options="employeeOptions"
              optionLabel="name"
              optionValue="value"
              :placeholder="t('pages.company.reports.elasticReports.filters.employees')"
              :maxSelectedLabels="2"
              class="flex-1 min-w-[180px]"
              filter
              :loading="reportsStore.isFiltersLoading"
              @change="onFilterChange"
            />
            <MultiSelect
              v-model="selectedProjects"
              :options="projectOptions"
              optionLabel="name"
              optionValue="value"
              :placeholder="t('pages.company.reports.elasticReports.filters.projects')"
              :maxSelectedLabels="2"
              class="flex-1 min-w-[180px]"
              filter
              :loading="reportsStore.isFiltersLoading"
              @change="onFilterChange"
            />
            <Select
              v-model="selectedBillable"
              :options="billableOptions"
              optionLabel="name"
              optionValue="value"
              :placeholder="t('pages.company.reports.elasticReports.filters.billable')"
              class="flex-1 min-w-[150px]"
              @change="onFilterChange"
            />
            <DatePicker
              v-model="selectedDateRange"
              selectionMode="range"
              :placeholder="t('pages.company.reports.elasticReports.filters.dateRange')"
              class="flex-1 min-w-[200px]"
              dateFormat="dd/mm/yy"
              showIcon
              @date-select="onFilterChange"
            />
            <Button
              :label="t('pages.company.reports.elasticReports.filters.clear')"
              severity="secondary"
              outlined
              @click="clearFilters"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Summary & Bar Chart -->
    <Card class="shadow-md border border-gray-100 rounded-xl">
      <template #header>
        <div class="flex items-center justify-between flex-wrap px-5 pt-5 gap-4">
          <div class="flex gap-6 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="text-gray-500">{{ t('pages.company.reports.elasticReports.summary.total') }}</span>
              <span class="font-semibold text-lg">{{ summary?.Total ?? '00:00' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500">{{ t('pages.company.reports.elasticReports.summary.billable') }}</span>
              <span class="font-semibold text-lg text-green-600">{{ summary?.Billable ?? '00:00' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500">{{ t('pages.company.reports.elasticReports.summary.unbillable') }}</span>
              <span class="font-semibold text-lg text-orange-600">{{ summary?.Unbillable ?? '00:00' }}</span>
            </div>
          </div>
          <Button
            icon="pi pi-download"
            :label="t('pages.company.reports.elasticReports.download')"
            severity="secondary"
            outlined
            :disabled="!reportsStore.downloadKey"
            @click="handleDownload"
          />
        </div>
      </template>
      <template #content>
        <div v-if="reportsStore.isLoading" class="flex justify-center items-center h-64">
          <ProgressSpinner />
        </div>
        <div v-else-if="hasChartData" class="h-80">
          <Chart :type="EChartType.BAR" :data="barChartData" :options="barChartOptions" class="h-full" />
        </div>
        <div v-else class="flex flex-col items-center gap-4 py-12">
          <img src="@/assets/images/noData.svg" alt="No Data" class="w-32" />
          <span class="text-gray-500">{{ t('pages.company.reports.elasticReports.noData') }}</span>
        </div>
      </template>
    </Card>

    <!-- Grouping Table & Pie Chart -->
    <Card class="shadow-md border border-gray-100 rounded-xl">
      <template #header>
        <div class="flex gap-4 px-5 pt-5">
          <Select
            v-model="selectedGroup1"
            :options="groupOptions"
            optionLabel="name"
            optionValue="value"
            :placeholder="t('pages.company.reports.elasticReports.groups.group1')"
            class="w-48"
            @change="onFilterChange"
          />
          <Select
            v-model="selectedGroup2"
            :options="groupOptions"
            optionLabel="name"
            optionValue="value"
            :placeholder="t('pages.company.reports.elasticReports.groups.group2')"
            class="w-48"
            @change="onFilterChange"
          />
        </div>
      </template>
      <template #content>
        <div v-if="reportsStore.isLoading" class="flex justify-center items-center h-64">
          <ProgressSpinner />
        </div>
        <div v-else class="flex gap-8 flex-col lg:flex-row">
          <!-- Data Table -->
          <DataTable
            :value="reportsStore.grouping"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            class="flex-1"
            stripedRows
          >
            <Column :field="'Group1'" :header="group1Label" sortable />
            <Column :field="'Group2'" :header="group2Label" sortable />
            <Column field="Total" :header="t('pages.company.reports.elasticReports.columns.total')" sortable />
            <template #empty>
              <div class="text-center text-gray-500 py-4">
                {{ t('pages.company.reports.elasticReports.noData') }}
              </div>
            </template>
          </DataTable>

          <!-- Pie Chart -->
          <div v-if="hasPieChartData" class="w-full lg:w-80">
            <Chart :type="EChartType.DOUGHNUT" :data="pieChartData" :options="pieChartOptions" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import MultiSelect from 'primevue/multiselect';
import ProgressSpinner from 'primevue/progressspinner';
import Select from 'primevue/select';

import { DownloadService } from '@/customClient/services/DownloadService';
import { EChartType } from '@/enums/chartType.enum';
import { formatDateToInterval } from '@/helpers/date';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { EBillableOptions, useReport } from '@/views/company/_composables/useReport';
import { EGroupOptions } from '@/views/company/_etc/groupOptions.enum';

const { t } = useI18n<{ message: MessageSchema }>();
const reportsStore = useCompanyReportsStore();
const { teamOptions, employeeOptions, projectOptions, billableOptions, groupOptions } = useReport();

// Filter state
const selectedTeams = ref<string[]>([]);
const selectedEmployees = ref<string[]>([]);
const selectedProjects = ref<string[]>([]);
const selectedBillable = ref<EBillableOptions>(EBillableOptions.ALL);
const today = new Date();
const selectedDateRange = ref<Date[]>([today, today]);
const selectedGroup1 = ref<EGroupOptions>(EGroupOptions.PROJECTS);
const selectedGroup2 = ref<EGroupOptions>(EGroupOptions.EMPLOYEES);

// Computed
const summary = computed(() => reportsStore.summary);

const group1Label = computed(() => {
  const option = groupOptions.value.find((o) => o.value === selectedGroup1.value);
  return option?.name ?? t('pages.company.reports.elasticReports.groups.group1');
});

const group2Label = computed(() => {
  const option = groupOptions.value.find((o) => o.value === selectedGroup2.value);
  return option?.name ?? t('pages.company.reports.elasticReports.groups.group2');
});

const hasChartData = computed(() => {
  return reportsStore.graphs?.Main?.datasets && reportsStore.graphs.Main.datasets.length > 0;
});

const hasPieChartData = computed(() => {
  return reportsStore.graphs?.Group && reportsStore.graphs.Group.length > 0;
});

const barChartData = computed(() => {
  const graphData = reportsStore.graphs?.Main;
  if (!graphData) return { labels: [], datasets: [] };

  return {
    labels: graphData.labels ?? [],
    datasets:
      graphData.datasets?.map((ds: any) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.backgroundColor || 'rgba(59, 130, 246, 0.8)',
        borderColor: ds.borderColor || 'rgb(59, 130, 246)',
        borderWidth: 1,
      })) ?? [],
  };
});

const barChartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColorSecondary,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder },
      },
      y: {
        beginAtZero: true,
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder },
      },
    },
  };
});

const pieChartData = computed(() => {
  const groupData = reportsStore.graphs?.Group ?? [];
  const colors = [
    'rgba(34, 197, 94, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(20, 184, 166, 0.8)',
  ];

  return {
    labels: groupData.map((d: any) => d.label),
    datasets: [
      {
        data: groupData.map((d: any) => d.value),
        backgroundColor: colors.slice(0, groupData.length),
        hoverBackgroundColor: colors.slice(0, groupData.length).map((c) => c.replace('0.8', '1')),
      },
    ],
  };
});

const pieChartOptions = computed(() => {
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

// Methods
const buildQueryPayload = () => {
  const [start, end] = selectedDateRange.value;
  // Format: DD.MM.YYYY-days (same as worktime usage)
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const interval = `${formatDateToInterval(start)}-${diffDays}`;

  return {
    Interval: interval,
    Teams: selectedTeams.value,
    Employees: selectedEmployees.value,
    Projects: selectedProjects.value,
    Billable: selectedBillable.value,
    Group1: selectedGroup1.value,
    Group2: selectedGroup2.value,
  };
};

const onFilterChange = () => {
  queryReport();
};

const queryReport = async () => {
  const payload = buildQueryPayload();
  await reportsStore.queryReport(payload);
};

const clearFilters = () => {
  selectedTeams.value = [];
  selectedEmployees.value = [];
  selectedProjects.value = [];
  selectedBillable.value = EBillableOptions.ALL;
  const now = new Date();
  selectedDateRange.value = [now, now];
  selectedGroup1.value = EGroupOptions.PROJECTS;
  selectedGroup2.value = EGroupOptions.EMPLOYEES;
  queryReport();
};

const handleDownload = () => {
  if (reportsStore.downloadKey) {
    DownloadService.downloadReport(reportsStore.downloadKey);
  }
};

onMounted(async () => {
  await reportsStore.fetchFilters();
  await queryReport();
});
</script>
