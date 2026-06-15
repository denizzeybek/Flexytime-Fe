<template>
  <Card class="shadow-md border border-border-secondary dark:border-border-primary rounded-xl transition-colors">
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4 flex-wrap">
          <MultiSelect
            v-if="canSeeOthers"
            v-model="teams"
            :options="teamOptions"
            optionLabel="name"
            optionValue="value"
            :placeholder="t('pages.company.reports.elasticReports.filters.teams')"
            :maxSelectedLabels="2"
            class="flex-1 min-w-[180px]"
            filter
            :loading="filtersLoading"
            @change="onChange"
          />
          <MultiSelect
            v-if="canSeeOthers"
            v-model="employees"
            :options="employeeOptions"
            optionLabel="name"
            optionValue="value"
            :placeholder="t('pages.company.reports.elasticReports.filters.employees')"
            :maxSelectedLabels="2"
            class="flex-1 min-w-[180px]"
            filter
            :loading="filtersLoading"
            @change="onChange"
          />
          <MultiSelect
            v-model="projects"
            :options="projectOptions"
            optionLabel="name"
            optionValue="value"
            :placeholder="t('pages.company.reports.elasticReports.filters.projects')"
            :maxSelectedLabels="2"
            class="flex-1 min-w-[180px]"
            filter
            :loading="filtersLoading"
            @change="onChange"
          />
          <Select
            v-model="billable"
            :options="billableOptions"
            optionLabel="name"
            optionValue="value"
            :placeholder="t('pages.company.reports.elasticReports.filters.billable')"
            class="flex-1 min-w-[150px]"
            @change="onChange"
          />
          <DatePicker
            v-model="dateRange"
            selectionMode="range"
            :placeholder="t('pages.company.reports.elasticReports.filters.dateRange')"
            class="flex-1 min-w-[200px]"
            dateFormat="dd/mm/yy"
            showIcon
            @date-select="onChange"
          />
          <Button
            :label="t('pages.company.reports.elasticReports.filters.clear')"
            severity="secondary"
            outlined
            @click="emit('clear')"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import DatePicker from 'primevue/datepicker';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';

import { type MessageSchema } from '@/plugins/i18n';
import { EBillableOptions } from '@/views/company/_composables/useReport';

interface NamedOption<T = string> {
  name: string;
  value: T;
}

interface IProps {
  canSeeOthers: boolean;
  teamOptions: NamedOption[];
  employeeOptions: NamedOption[];
  projectOptions: NamedOption[];
  billableOptions: NamedOption<EBillableOptions>[];
  filtersLoading: boolean;
}

interface IEmits {
  (event: 'change'): void;
  (event: 'clear'): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();

const teams = defineModel<string[]>('teams', { required: true });
const employees = defineModel<string[]>('employees', { required: true });
const projects = defineModel<string[]>('projects', { required: true });
const billable = defineModel<EBillableOptions>('billable', { required: true });
const dateRange = defineModel<Date[]>('dateRange', { required: true });

const { t } = useI18n<{ message: MessageSchema }>();

const onChange = () => emit('change');
</script>
