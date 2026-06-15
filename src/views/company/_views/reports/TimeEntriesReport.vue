<template>
  <div class="flex flex-col gap-6">
    <TimeEntriesFilterBar
      v-model:teams="report.selectedTeams.value"
      v-model:employees="report.selectedEmployees.value"
      v-model:projects="report.selectedProjects.value"
      v-model:billable="report.selectedBillable.value"
      v-model:dateRange="report.selectedDateRange.value"
      :can-see-others="report.canSeeOthers.value"
      :team-options="report.teamOptions.value"
      :employee-options="report.employeeOptions.value"
      :project-options="report.projectOptions.value"
      :billable-options="report.billableOptions.value"
      :filters-loading="reportsStore.isFiltersLoading"
      @change="report.onFilterChange"
      @clear="report.clearFilters"
    />

    <TimeEntriesSummaryCard
      v-model:dialog-open="report.saveFilterDialog.value"
      v-model:filter-name="report.saveFilterName.value"
      :summary="report.summary.value"
      :is-loading="reportsStore.isLoading"
      :has-chart-data="report.hasChartData.value"
      :chart-data="report.barChartData.value"
      :chart-options="report.barChartOptions.value"
      :saving="report.savingFilter.value"
      @save-filter="report.openSaveFilterDialog"
      @download="report.handleDownload"
      @confirm-save="report.confirmSaveFilter"
    />

    <TimeEntriesGroupingCard
      v-model:group1="report.selectedGroup1.value"
      v-model:group2="report.selectedGroup2.value"
      :group-options="report.groupOptions.value"
      :group1-label="report.group1Label.value"
      :group2-label="report.group2Label.value"
      :grouping="reportsStore.grouping"
      :has-pie-chart-data="report.hasPieChartData.value"
      :pie-chart-data="report.pieChartData.value"
      :pie-chart-options="report.pieChartOptions.value"
      :is-loading="reportsStore.isLoading"
      @change="report.onFilterChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useCompanyReportsStore } from '@/stores/company/reports';
import { useTimeEntriesReport } from '@/views/company/_composables/useTimeEntriesReport';

import TimeEntriesFilterBar from './_components/TimeEntriesFilterBar.vue';
import TimeEntriesGroupingCard from './_components/TimeEntriesGroupingCard.vue';
import TimeEntriesSummaryCard from './_components/TimeEntriesSummaryCard.vue';

const reportsStore = useCompanyReportsStore();
const report = useTimeEntriesReport();

onMounted(() => report.bootstrap());
</script>
