<template>
  <div class="productivity-tab">
    <EmployeeProductivityTable
      v-if="viewMode === 'individual'"
      :individuals="individuals"
      :is-loading="isLoading"
    />

    <EmployeeProductivityTable
      v-else-if="viewMode === 'employees'"
      :individuals="individuals"
      :is-loading="isLoading"
    />

    <template v-else-if="viewMode === 'team'">

      <EmployeeProductivityTable
        v-if="currentTeamId"
        :individuals="filteredIndividuals"
        :is-loading="isLoading"
      />

      <TeamProductivityTable
        v-else-if="isLoading || teamRowsWithCompany.length > 0"
        :teams="teamRowsWithCompany"
        :is-loading="isLoading"
      />

      <NoDataState v-else-if="!isLoading" :message="t('components.productivity.noDataAvailable')" />
    </template>

    <NoDataState v-else-if="!isLoading" :message="t('components.productivity.noDataAvailable')" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import NoDataState from '@/components/common/NoDataState.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { useWorktimeStore } from '@/stores/worktimeUsage/worktimeStore';

import { useWorktimeQuery } from '../../_composables';
import EmployeeProductivityTable from '../tables/EmployeeProductivityTable.vue';
import TeamProductivityTable from '../tables/TeamProductivityTable.vue';

import type { DisplayMode, IIndividual, ITeam, ViewMode } from '../../_types';

interface IProps {
  viewMode: ViewMode;
  displayMode?: DisplayMode;
  teams?: ITeam[];
  individuals?: IIndividual[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  displayMode: 'team',
  teams: () => [],
  individuals: () => [],
  isLoading: false,
});

const { t } = useI18n<{ message: MessageSchema }>();
const { currentQuery } = useWorktimeQuery();
const store = useWorktimeStore();

const currentTeamId = computed(() => currentQuery.value.teamId ?? null);

const teamRowsWithCompany = computed<ITeam[]>(() => {
  const companyRow = store.getCompanyRow as ITeam | null;
  const rows: ITeam[] = [];
  if (companyRow) rows.push(companyRow);
  for (const t of props.teams) rows.push(t);
  return rows;
});

const filteredIndividuals = computed<IIndividual[]>(() => {
  if (!currentTeamId.value) return props.individuals;
  return props.individuals.filter((row) => {
    const teamRef = row as IIndividual & { TeamId?: string | null };
    return teamRef.TeamId === currentTeamId.value;
  });
});
</script>
