<template>
  <EmployeesTable :is-loading="isLoading" @new="handleNew" @edit="handleEdit" />
  <EmployeeModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentEmployee"
    @fetchEmployees="fetchEmployees"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';

import EmployeeModal from './_modals/EmployeeModal.vue';
import EmployeesTable from './EmployeesTable.vue';

import type { TheMemberViewModel } from '@/client';

const employeesStore = useHRSettingsEmployeesStore();
const { showErrorMessage } = useFToast();

const isLoading = computed(() => employeesStore.isLoading);

const currentEmployee = ref<TheMemberViewModel>();
const isModalOpen = ref(false);

const handleNew = () => {
  isModalOpen.value = true;
  currentEmployee.value = undefined;
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
  fetchEmployees();
});
</script>

<style scoped></style>
