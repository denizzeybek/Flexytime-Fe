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
        <Skeleton v-if="isLoading" height="1.5rem" width="6rem" />
        <div v-else-if="slotProps.data.Wellbeing?.Danger?.length > 0" class="flex gap-1.5 flex-wrap">
          <i
            v-for="item in slotProps.data.Wellbeing.Danger"
            :key="item.id"
            v-tooltip.top="item.text || item.Name"
            :class="[getWellbeingIcon(item.Type), 'text-red-600 cursor-help text-lg']"
          ></i>
        </div>
        <span v-else class="text-gray-400">-</span>
      </template>
    </Column>

    <Column field="Wellbeing.Warning" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.warnings')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="6rem" />
        <div v-else-if="slotProps.data.Wellbeing?.Warning?.length > 0" class="flex gap-1.5 flex-wrap">
          <i
            v-for="item in slotProps.data.Wellbeing.Warning"
            :key="item.id"
            v-tooltip.top="item.text || item.Name"
            :class="[getWellbeingIcon(item.Type), 'text-orange-500 cursor-help text-lg']"
          ></i>
        </div>
        <span v-else class="text-gray-400">-</span>
      </template>
    </Column>

    <Column field="Wellbeing.Success" :header="t('pages.worktimeUsage.tables.employeeWellbeing.columns.achievements')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="6rem" />
        <div v-else-if="slotProps.data.Wellbeing?.Success?.length > 0" class="flex gap-1.5 flex-wrap">
          <i
            v-for="item in slotProps.data.Wellbeing.Success"
            :key="item.id"
            v-tooltip.top="item.text || item.Name"
            :class="[getWellbeingIcon(item.Type), 'text-green-600 cursor-help text-lg']"
          ></i>
        </div>
        <span v-else class="text-gray-400">-</span>
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
import Tooltip from 'primevue/tooltip';

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

// Register tooltip directive
const vTooltip = Tooltip;

// Map backend wellbeing types to PrimeVue icons
const getWellbeingIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    overloaded: 'pi pi-exclamation-triangle',
    overmeeting: 'pi pi-users',
    overtime: 'pi pi-clock',
    distract: 'pi pi-eye-slash',
    automation: 'pi pi-cog',
    fragmented: 'pi pi-th-large',
    nocturnal: 'pi pi-moon',
    uninterrupted: 'pi pi-check-circle',
    massemail: 'pi pi-envelope',
    balanced: 'pi pi-heart',
  };

  return iconMap[type] || 'pi pi-circle';
};

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
