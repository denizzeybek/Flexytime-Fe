<template>
  <EmployeesTable :is-loading="isLoading" @new="handleNew" @edit="handleEdit" />
  <EmployeeModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentEmployee"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';
import { useHRSettingsTeamsStore } from '@/stores/hrSettings/teams';
import { useHRSettingsTitlesStore } from '@/stores/hrSettings/titles';

import EmployeeModal from './_modals/EmployeeModal.vue';
import EmployeesTable from './EmployeesTable.vue';

import type { TheMemberViewModel } from '@/client';

const employeesStore = useHRSettingsEmployeesStore();
const titlesStore = useHRSettingsTitlesStore();
const teamsStore = useHRSettingsTeamsStore();
const { showErrorMessage } = useFToast();

const currentEmployee = ref<TheMemberViewModel>();
const isModalOpen = ref(false);

const isLoading = computed(() => employeesStore.isLoading);

const handleNew = async () => {
  currentEmployee.value = undefined;
  await nextTick();
  isModalOpen.value = true;
};

const handleEdit = async (employee: TheMemberViewModel) => {
  if (!employee.ID) return;
  try {
    const detail = await employeesStore.fetchEmployeeDetail(employee.ID);
    currentEmployee.value = detail ?? employee;
  } catch (error) {
    showErrorMessage(error as Error);
    currentEmployee.value = employee;
  }
  isModalOpen.value = true;
};

const fetchEmployees = async () => {
  try {
    await employeesStore.filter();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

/**
 * Title + Team dropdowns in the Add/Edit Employee modal read from
 * `titlesStore.list` / `teamsStore.list`. Hydrating them here, awaited
 * and in parallel, makes the data deterministically present in Pinia
 * before the modal can possibly open — previously the modal's own
 * `EmployeeRoleSection` fetched concurrently with a fire-and-forget
 * fetch from this page, racing the FSelect's reactive `:options`
 * binding and producing the "Pinia full, dropdown empty" UX bug.
 */
const fetchModalLookups = async () => {
  const tasks: Array<Promise<unknown>> = [];
  if (titlesStore.list.length === 0) tasks.push(titlesStore.fetchTitles());
  if (teamsStore.list.length === 0) tasks.push(teamsStore.fetchTeams());
  if (tasks.length > 0) {
    try {
      await Promise.all(tasks);
    } catch (error) {
      showErrorMessage(error as Error);
    }
  }
};

onMounted(() => {
  void fetchEmployees();
  void fetchModalLookups();
});
</script>
