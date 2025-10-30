<template>
  <DataTable
    :value="isLoading ? skeletonData : teams"
    striped-rows
    paginator
    :rows="10"
    :rows-per-page-options="[5, 10, 20, 50]"
    table-style="min-width: 50rem"
  >
    <Column field="TeamName" header="Department Name" sortable>
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

    <Column field="SuperVisorName" header="Supervisor" sortable>
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
import { useWorktimeNavigation } from '../../composables';
import type { ITeam } from '../../types';

interface IProps {
  teams?: ITeam[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  teams: () => [],
  isLoading: false,
});

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
