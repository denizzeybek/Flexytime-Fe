<template>
  <div class="productivity-tab">
    <!-- Individual View: Always show individuals -->
    <EmployeeProductivityTable
      v-if="viewMode === 'individual'"
      :individuals="individuals"
      :is-loading="isLoading"
    />

    <!-- Employees View: Always show all employees -->
    <EmployeeProductivityTable
      v-else-if="viewMode === 'employees'"
      :individuals="individuals"
      :is-loading="isLoading"
    />

    <!-- Team View with displayMode toggle -->
    <template v-else-if="viewMode === 'team'">
      <!-- Show teams when displayMode is 'team' -->
      <TeamProductivityTable
        v-if="displayMode === 'team' && (isLoading || teams.length > 0)"
        :teams="teams"
        :is-loading="isLoading"
      />

      <!-- Show individuals when displayMode is 'employees' OR no teams exist (leaf node) -->
      <EmployeeProductivityTable
        v-else-if="isLoading || (displayMode === 'employees' && individuals.length > 0) || (teams.length === 0 && individuals.length > 0)"
        :individuals="individuals"
        :is-loading="isLoading"
      />

      <!-- Empty state (only show when NOT loading and no data) -->
      <div v-else-if="!isLoading" class="text-center text-gray-500 p-8">
        <p>{{ $t('components.productivity.noDataAvailable') }}</p>
      </div>
    </template>

    <!-- Fallback empty state -->
    <div v-else-if="!isLoading" class="text-center text-gray-500 p-8">
      <p>{{ $t('components.productivity.noDataAvailable') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

import EmployeeProductivityTable from '../tables/EmployeeProductivityTable.vue';
import TeamProductivityTable from '../tables/TeamProductivityTable.vue';

import type { DisplayMode, IIndividual,ITeam, ViewMode } from '../../_types';

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

const { t } = useI18n<{ message: MessageSchema }>();

</script>
