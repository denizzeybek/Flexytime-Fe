<template>
  <DataTable
    :value="isLoading ? skeletonData : individuals"
    striped-rows
    paginator
    :rows="10"
    :rows-per-page-options="[5, 10, 20, 50]"
    table-style="min-width: 50rem"
  >
    <Column field="EmployeeName" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.employeeName')" sortable>
      <template #body="slotProps">
        <div v-if="isLoading" class="flex items-center gap-2">
          <Skeleton shape="circle" size="2.5rem" />
          <Skeleton height="1.5rem" width="8rem" />
        </div>
        <a
          v-else-if="slotProps.data.Employee"
          href="#"
          class="text-gray-900 hover:text-gray-600 hover:underline cursor-pointer flex items-center gap-2"
          @click.prevent="handleEmployeeClick(slotProps.data.Employee.MemberUrl)"
        >
          <Avatar
            v-if="slotProps.data.Employee.ImageUrl"
            :image="slotProps.data.Employee.ImageUrl"
            shape="circle"
            size="normal"
          />
          <Avatar
            v-else
            :label="slotProps.data.Employee.Abbreviation"
            shape="circle"
            size="normal"
          />
          {{ slotProps.data.EmployeeName }}
        </a>
      </template>
    </Column>

    <Column field="TeamName" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.team')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.TeamName || '-' }}</span>
      </template>
    </Column>

    <Column field="Start.time" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.startTime')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.Start?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="End.time" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.endTime')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.End?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="Wellbeing.Danger" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.problems')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="3rem" />
        <Tag
          v-else-if="slotProps.data.Wellbeing?.Danger?.length > 0"
          severity="danger"
          :value="slotProps.data.Wellbeing.Danger.length"
        />
        <span v-else>-</span>
      </template>
    </Column>

    <Column field="Wellbeing.Warning" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.warnings')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="3rem" />
        <Tag
          v-else-if="slotProps.data.Wellbeing?.Warning?.length > 0"
          severity="warn"
          :value="slotProps.data.Wellbeing.Warning.length"
        />
        <span v-else>-</span>
      </template>
    </Column>

    <Column field="Wellbeing.Success" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.achievements')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="3rem" />
        <Tag
          v-else-if="slotProps.data.Wellbeing?.Success?.length > 0"
          severity="success"
          :value="slotProps.data.Wellbeing.Success.length"
        />
        <span v-else>-</span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Avatar from 'primevue/avatar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';

import { type MessageSchema } from '@/plugins/i18n';

import { useWorktimeNavigation } from '../../_composables';

import type { IIndividual } from '../../_types';

interface IProps {
  individuals?: IIndividual[];
  isLoading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  individuals: () => [],
  isLoading: false,
});

const { t } = useI18n<{ message: MessageSchema }>();

const { handleEmployeeClick } = useWorktimeNavigation();

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  EmployeeName: '',
  TeamName: '',
  Employee: null,
  Team: null,
  Tags: [],
  Start: { time: '', statisticType: '' },
  End: { time: '', statisticType: '' },
  Work: { time: '', statisticType: '' },
  Leisure: { time: '', statisticType: '' },
  Meeting: { time: '', statisticType: '' },
  Unclassified: { time: '', statisticType: '' },
  Wellbeing: { Danger: [], Warning: [], Success: [] },
}));
</script>
