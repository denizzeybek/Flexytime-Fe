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
  // The list payload deliberately omits `Email` (per the v2 contract:
  // "Set by the single-member read for the edit form"), and the BE has
  // it on `POST /webapi/definition/employee`. Round-trip there before
  // opening the modal so the form seeds with the full shape rather
  // than a stale list-row snapshot.
  if (!employee.ID) return;
  try {
    const detail = await employeesStore.fetchEmployeeDetail(employee.ID);
    currentEmployee.value = detail ?? employee;
  } catch (error) {
    // Fall back to the list-row data so the operator can still edit
    // Name / Team / Title / Salary even if the detail fetch errored.
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

onMounted(() => {
  // Kick off the roster + the two lookup lists that feed the Add/Edit
  // modal's Title / Team `<FSelect>` dropdowns. EmployeeRoleSection used
  // to fetch them lazily on its own `onMounted`, but the modal mounts
  // AFTER the page is interactive — so the operator briefly saw empty
  // dropdowns on the first click. Pulling the fetches up here means
  // by the time the modal opens both stores are populated.
  void fetchEmployees();
  if (titlesStore.list.length === 0) void titlesStore.fetchTitles();
  if (teamsStore.list.length === 0) void teamsStore.fetchTeams();
});
</script>
