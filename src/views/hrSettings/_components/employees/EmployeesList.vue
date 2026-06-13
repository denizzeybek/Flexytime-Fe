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

const handleEdit = (employee: TheMemberViewModel) => {
  currentEmployee.value = employee;
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
