<template>
  <Card class="shadow-md border border-border-secondary dark:border-border-primary rounded-xl transition-colors">
    <template #header>
      <div class="flex gap-4 px-5 pt-5">
        <Select
          v-model="group1"
          :options="groupOptions"
          optionLabel="name"
          optionValue="value"
          :placeholder="t('pages.company.reports.elasticReports.groups.group1')"
          class="w-48"
          @change="emit('change')"
        />
        <Select
          v-model="group2"
          :options="groupOptions"
          optionLabel="name"
          optionValue="value"
          :placeholder="t('pages.company.reports.elasticReports.groups.group2')"
          class="w-48"
          @change="emit('change')"
        />
      </div>
    </template>
    <template #content>
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <ProgressSpinner />
      </div>
      <div v-else class="flex gap-8 flex-col lg:flex-row">
        <DataTable
          :value="grouping"
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
            <div class="text-center text-content-tertiary py-4">
              {{ t('pages.company.reports.elasticReports.noData') }}
            </div>
          </template>
        </DataTable>
        <div v-if="hasPieChartData" class="w-full lg:w-80">
          <Chart :type="EChartType.DOUGHNUT" :data="pieChartData" :options="pieChartOptions" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import ProgressSpinner from 'primevue/progressspinner';
import Select from 'primevue/select';

import { EChartType } from '@/enums/chartType.enum';
import { type MessageSchema } from '@/plugins/i18n';
import { EGroupOptions } from '@/views/company/_etc/groupOptions.enum';

import type { ReportGroupViewModel } from '@/client';

interface NamedOption {
  name: string;
  value: EGroupOptions;
}

interface IProps {
  groupOptions: NamedOption[];
  group1Label: string;
  group2Label: string;
  grouping: ReportGroupViewModel[];
  hasPieChartData: boolean;
  pieChartData: Record<string, unknown>;
  pieChartOptions: Record<string, unknown>;
  isLoading: boolean;
}

interface IEmits {
  (event: 'change'): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();

const group1 = defineModel<EGroupOptions>('group1', { required: true });
const group2 = defineModel<EGroupOptions>('group2', { required: true });

const { t } = useI18n<{ message: MessageSchema }>();
</script>
