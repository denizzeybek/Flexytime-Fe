<template>
  <TreeTable
    :value="isLoading ? skeletonNodes : nodes"
    :rows="10"
    table-style="min-width: 50rem"
    sort-field="data.Work.time"
    :sort-order="-1"
  >
    <Column
      field="TeamName"
      :header="t('pages.worktimeUsage.tables.teamProductivity.columns.departmentName')"
      expander
      sortable
    >
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <a
          v-else-if="slotProps.node.data.nodeType === 'team'"
          href="#"
          class="text-content-primary hover:text-content-secondary hover:underline cursor-pointer"
          @click.prevent="handleTeamClick(slotProps.node.data.ID)"
        >
          {{ slotProps.node.data.TeamName }}
        </a>
        <a
          v-else
          href="#"
          class="text-content-secondary hover:text-content-primary hover:underline cursor-pointer flex items-center gap-2"
          @click.prevent="handleEmployeeClick(slotProps.node.data.ID)"
        >
          <Avatar
            :label="getAvatarLabel(slotProps.node.data.TeamName)"
            shape="circle"
            size="normal"
          />
          {{ slotProps.node.data.TeamName }}
        </a>
      </template>
    </Column>

    <Column
      field="Start.time"
      :header="t('pages.worktimeUsage.tables.teamProductivity.columns.startTime')"
      sortable
    >
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.node.data.Start?.time || '-' }}</span>
      </template>
    </Column>

    <Column
      field="End.time"
      :header="t('pages.worktimeUsage.tables.teamProductivity.columns.endTime')"
      sortable
    >
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.node.data.End?.time || '-' }}</span>
      </template>
    </Column>

    <Column
      field="Work.time"
      :header="t('pages.worktimeUsage.tables.teamProductivity.columns.work')"
      sortable
    >
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-wrench text-green-600"></i>
          <span class="font-semibold">{{ formatDuration(slotProps.node.data.Work?.time) }}</span>
        </div>
      </template>
    </Column>

    <Column
      field="Leisure.time"
      :header="t('pages.worktimeUsage.tables.teamProductivity.columns.leisure')"
      sortable
    >
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-calendar-clock text-red-600"></i>
          <span class="font-semibold">{{ formatDuration(slotProps.node.data.Leisure?.time) }}</span>
        </div>
      </template>
    </Column>

    <Column
      field="Meeting.time"
      :header="t('pages.worktimeUsage.tables.teamProductivity.columns.meeting')"
      sortable
    >
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-crown text-yellow-600"></i>
          <span class="font-semibold">{{ formatDuration(slotProps.node.data.Meeting?.time) }}</span>
        </div>
      </template>
    </Column>

    <Column
      field="Unclassified.time"
      :header="t('pages.worktimeUsage.tables.teamProductivity.columns.unclassified')"
      sortable
    >
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <div v-else class="flex items-center gap-2">
          <i class="pi pi-question text-content-tertiary"></i>
          <span class="font-semibold">
            {{ formatDuration(slotProps.node.data.Unclassified?.time) }}
          </span>
        </div>
      </template>
    </Column>
  </TreeTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Avatar from 'primevue/avatar';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import TreeTable from 'primevue/treetable';

import { getAvatarLabel } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';

import { useTimeFormat, useWorktimeNavigation } from '../../_composables';

interface ITreeNode {
  key: string;
  data: Record<string, unknown>;
  children?: ITreeNode[];
}

interface IProps {
  nodes?: ITreeNode[];
  isLoading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  nodes: () => [],
  isLoading: false,
});

const { t } = useI18n<{ message: MessageSchema }>();

const { handleTeamClick, handleEmployeeClick } = useWorktimeNavigation();
const { formatDuration } = useTimeFormat();

const skeletonNodes: ITreeNode[] = Array.from({ length: 5 }, (_, i) => ({
  key: `skeleton-${i}`,
  data: {
    nodeType: 'team',
    ID: `skeleton-${i}`,
    TeamName: '',
    Start: { time: '', statisticType: '' },
    End: { time: '', statisticType: '' },
    Work: { time: '', statisticType: '' },
    Leisure: { time: '', statisticType: '' },
    Meeting: { time: '', statisticType: '' },
    Unclassified: { time: '', statisticType: '' },
  },
}));
</script>
