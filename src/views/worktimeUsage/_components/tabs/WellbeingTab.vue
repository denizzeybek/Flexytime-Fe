<template>
  <div class="wellbeing-tab">
    <!-- Individual View: Placeholder -->
    <div v-if="viewMode === 'individual'" class="p-4 text-center text-gray-500">
      <p>Wellbeing data for individual view will be implemented soon.</p>
    </div>

    <!-- Employees View: Always show all employees -->
    <EmployeeWellbeingTable
      v-else-if="viewMode === 'employees'"
      :individuals="individuals"
      :is-loading="isLoading"
    />

    <!-- Team View with displayMode toggle -->
    <template v-else-if="viewMode === 'team'">
      <!-- Show teams when displayMode is 'team' -->
      <TeamWellbeingTable
        v-if="displayMode === 'team' && (isLoading || teams.length > 0)"
        :teams="teams"
        :is-loading="isLoading"
      />

      <!-- Show individuals when displayMode is 'employees' OR no teams exist (leaf node) -->
      <EmployeeWellbeingTable
        v-else-if="isLoading || (displayMode === 'employees' && individuals.length > 0) || (teams.length === 0 && individuals.length > 0)"
        :individuals="individuals"
        :is-loading="isLoading"
      />

      <!-- Empty state (only show when NOT loading and no data) -->
      <div v-else-if="!isLoading" class="text-center text-gray-500 p-8">
        <p>No data available.</p>
      </div>
    </template>

    <!-- Fallback empty state -->
    <div v-else-if="!isLoading" class="text-center text-gray-500 p-8">
      <p>No data available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeamWellbeingTable from '../tables/TeamWellbeingTable.vue';
import EmployeeWellbeingTable from '../tables/EmployeeWellbeingTable.vue';
import type { ViewMode, DisplayMode, ITeam, IIndividual } from '../../_types';

interface IProps {
  viewMode: ViewMode;
  displayMode?: DisplayMode;
  teams?: ITeam[];
  individuals?: IIndividual[];
  isLoading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  displayMode: 'team',
  teams: () => [],
  individuals: () => [],
  isLoading: false,
});
</script>
