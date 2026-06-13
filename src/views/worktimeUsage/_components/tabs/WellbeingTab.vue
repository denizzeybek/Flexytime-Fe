<template>
  <div class="wellbeing-tab">
    <!-- Individual View: Show individual wellbeing cards -->
    <IndividualWellbeingCard
      v-if="viewMode === 'individual'"
      :wellbeings="individualWellbeings"
      :is-loading="isLoading"
    />

    <!-- Employees View: Always show all employees -->
    <EmployeeWellbeingTable
      v-else-if="viewMode === 'employees'"
      :individuals="individuals"
      :is-loading="isLoading"
    />

    <!-- Team View with Company → Team → Employee drill-down ladder (mirrors
         ProductivityTab). Restored from legacy v1: user lands on the
         Company row at the top of the team table, clicks a team to drill
         into its employees, clicks the Company breadcrumb segment to come
         back up. -->
    <template v-else-if="viewMode === 'team'">
      <!-- Drilled INTO a specific team: show its employees. During re-fetch
           we render the employees table skeleton, matching the level the
           user is navigating to. -->
      <EmployeeWellbeingTable
        v-if="currentTeamId"
        :individuals="filteredIndividuals"
        :is-loading="isLoading"
      />

      <!-- Root level: Company row pinned on top + per-team rows. -->
      <TeamWellbeingTable
        v-else-if="isLoading || teamRowsWithCompany.length > 0"
        :teams="teamRowsWithCompany"
        :is-loading="isLoading"
      />

      <!-- Empty state (only show when NOT loading and no data) -->
      <NoDataState v-else-if="!isLoading" :message="t('components.wellbeing.noDataAvailable')" />
    </template>

    <!-- Fallback empty state -->
    <NoDataState v-else-if="!isLoading" :message="t('components.wellbeing.noDataAvailable')" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import NoDataState from '@/components/common/NoDataState.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { useWorktimeStore } from '@/stores/worktimeUsage/worktimeStore';

import { useWorktimeQuery } from '../../_composables';
import IndividualWellbeingCard from '../cards/IndividualWellbeingCard.vue';
import EmployeeWellbeingTable from '../tables/EmployeeWellbeingTable.vue';
import TeamWellbeingTable from '../tables/TeamWellbeingTable.vue';

import type { DisplayMode, IIndividual, IIndividualWellbeing, ITeam, ViewMode } from '../../_types';

interface IProps {
  viewMode: ViewMode;
  displayMode?: DisplayMode;
  teams?: ITeam[];
  individuals?: IIndividual[];
  individualWellbeings?: IIndividualWellbeing[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  displayMode: 'team',
  teams: () => [],
  individuals: () => [],
  individualWellbeings: () => [],
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
