<template>
  <DataTable
    :value="isLoading ? skeletonData : individuals"
    striped-rows
    paginator
    :rows="10"
    :rows-per-page-options="[5, 10, 20, 50]"
    table-style="min-width: 50rem"
  >
    <Column field="EmployeeName" header="Employee Name" sortable>
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

    <Column field="TeamName" header="Team" sortable>
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

    <Column field="Tags" header="Tags">
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

    <Column field="Start.time" header="Start Time" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.Start?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="End.time" header="End Time" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.End?.time || '-' }}</span>
      </template>
    </Column>

    <Column field="Work.time" header="Work" sortable>
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

    <Column field="Leisure.time" header="Leisure" sortable>
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

    <Column field="Meeting.time" header="Meeting" sortable>
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

    <Column field="Unclassified.time" header="Unclassified" sortable>
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Skeleton from 'primevue/skeleton';
import { useWorktimeNavigation } from '../../_composables';
import type { IIndividual } from '../../_types';

interface IProps {
  individuals?: IIndividual[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  individuals: () => [],
  isLoading: false,
});

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
