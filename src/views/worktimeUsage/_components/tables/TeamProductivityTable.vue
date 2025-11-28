<template>
  <DataTable
    :value="isLoading ? skeletonData : teams"
    striped-rows
    paginator
    :rows="10"
    :rows-per-page-options="[5, 10, 20, 50]"
    table-style="min-width: 50rem"
    sort-field="Work.time"
    :sort-order="-1"
  >
    <Column field="TeamName" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.departmentName')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <a
          v-else
          href="#"
          class="text-gray-900 hover:text-gray-600 hover:underline cursor-pointer"
          @click.prevent="handleTeamClick(slotProps.data.ID)"
        >
          {{ slotProps.data.TeamName }}
        </a>
      </template>
    </Column>

    <Column field="SuperVisorName" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.supervisor')" sortable>
      <template #body="slotProps">
        <div v-if="isLoading" class="flex items-center gap-2">
          <Skeleton shape="circle" size="2.5rem" />
          <Skeleton height="1.5rem" width="8rem" />
        </div>
        <!-- If Supervisor has MemberId or MemberUrl, make it clickable -->
        <a
          v-else-if="
            slotProps.data.Supervisor &&
            (slotProps.data.Supervisor.MemberId || slotProps.data.Supervisor.MemberUrl)
          "
          href="#"
          class="text-gray-900 hover:text-gray-600 hover:underline cursor-pointer flex items-center gap-2"
          @click.prevent="
            handleEmployeeClick(
              slotProps.data.Supervisor.MemberId || slotProps.data.Supervisor.MemberUrl,
            )
          "
        >
          <Avatar
            v-if="slotProps.data.Supervisor.ImageUrl"
            :image="slotProps.data.Supervisor.ImageUrl"
            shape="circle"
            size="normal"
          />
          <Avatar
            v-else
            :label="slotProps.data.Supervisor.Abbreviation"
            shape="circle"
            size="normal"
          />
          {{ slotProps.data.SupervisorName }}
        </a>
        <!-- If no ID, just show as plain text -->
        <div v-else-if="slotProps.data.Supervisor" class="flex items-center gap-2 text-gray-600">
          <Avatar
            v-if="slotProps.data.Supervisor.ImageUrl"
            :image="slotProps.data.Supervisor.ImageUrl"
            shape="circle"
            size="normal"
          />
          <Avatar
            v-else
            :label="slotProps.data.Supervisor.Abbreviation"
            shape="circle"
            size="normal"
          />
          {{ slotProps.data.SupervisorName }}
        </div>
      </template>
    </Column>

    <Column field="Start.time" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.startTime')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.Start?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="End.time" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.endTime')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.End?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="Work.time" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.work')" sortable>
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

    <Column field="Leisure.time" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.leisure')" sortable>
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

    <Column field="Meeting.time" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.meeting')" sortable>
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

    <Column field="Unclassified.time" :header="t('pages.worktimeUsage.tables.teamProductivity.columns.unclassified')" sortable>
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

import { type MessageSchema } from '@/plugins/i18n';

import { useWorktimeNavigation } from '../../_composables';

import type { ITeam } from '../../_types';

interface IProps {
  teams?: ITeam[];
  isLoading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  teams: () => [],
  isLoading: false,
});

const { t } = useI18n<{ message: MessageSchema }>();

const { handleTeamClick, handleEmployeeClick } = useWorktimeNavigation();

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  TeamName: '',
  SupervisorName: '',
  Supervisor: null,
  Team: null,
  Start: { time: '', statisticType: '' },
  End: { time: '', statisticType: '' },
  Work: { time: '', statisticType: '' },
  Leisure: { time: '', statisticType: '' },
  Meeting: { time: '', statisticType: '' },
  Unclassified: { time: '', statisticType: '' },
  Wellbeing: { Danger: [], Warning: [], Success: [] },
}));
</script>
