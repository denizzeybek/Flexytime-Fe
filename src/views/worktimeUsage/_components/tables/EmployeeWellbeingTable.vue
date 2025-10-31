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
        <span v-else>{{ slotProps.data.TeamName || '-' }}</span>
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

    <Column field="Wellbeing.Danger" header="Problems">
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

    <Column field="Wellbeing.Warning" header="Warnings">
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

    <Column field="Wellbeing.Success" header="Achievements">
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

withDefaults(defineProps<IProps>(), {
  individuals: () => [],
  isLoading: false,
});

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
