<template>
  <DataTable
    :value="isLoading ? skeletonData : individuals"
    striped-rows
    paginator
    :rows="10"
    :rows-per-page-options="[5, 10, 20, 50]"
    table-style="min-width: 50rem"
    sort-field="Work.time"
    :sort-order="-1"
  >
    <Column field="EmployeeName" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.employeeName')" sortable>
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

    <Column field="TeamName" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.team')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <a
          v-else-if="slotProps.data.Team"
          href="#"
          class="text-gray-900 hover:text-gray-600 hover:underline cursor-pointer"
          @click.prevent="handleTeamClick(slotProps.data.ID)"
        >
          {{ slotProps.data.TeamName }}
        </a>
      </template>
    </Column>

    <Column field="Tags" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.tags')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="3rem" />
        <div
          v-else-if="slotProps.data.Tags && slotProps.data.Tags.length > 0"
          class="flex gap-1 flex-wrap"
        >
          <Tag v-for="(tag, idx) in slotProps.data.Tags" :key="idx" :value="tag" severity="info" />
        </div>
        <span v-else>-</span>
      </template>
    </Column>

    <Column field="Start.time" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.startTime')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.Start?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="End.time" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.endTime')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.End?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="Work.time" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.work')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-wrench text-green-600"></i>
          <span class="font-semibold">
            {{ slotProps.data.Work?.time || '-' }}
          </span>
        </div>
      </template>
    </Column>

    <Column field="Leisure.time" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.leisure')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-calendar-clock text-red-600"></i>
          <span class="font-semibold">
            {{ slotProps.data.Leisure?.time || '-' }}
          </span>
        </div>
      </template>
    </Column>

    <Column field="Meeting.time" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.meeting')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-crown text-yellow-600"></i>
          <span class="font-semibold">
            {{ slotProps.data.Meeting?.time || '-' }}
          </span>
        </div>
      </template>
    </Column>

    <Column field="Unclassified.time" :header="t('pages.worktimeUsage.tables.employeeProductivity.columns.unclassified')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-question text-gray-600"></i>
          <span class="font-semibold">
            {{ slotProps.data.Unclassified?.time || '-' }}
          </span>
        </div>
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

const { handleTeamClick, handleEmployeeClick } = useWorktimeNavigation();

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
