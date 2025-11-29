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
import { onMounted, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';

import EmployeeModal from './_modals/EmployeeModal.vue';
import EmployeesTable from './EmployeesTable.vue';

const employeesStore = useHRSettingsEmployeesStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const currentEmployee = ref();
const isModalOpen = ref(false);

const handleNew = () => {
  isModalOpen.value = true;
  currentEmployee.value = undefined;
};

const handleEdit = (employee) => {
  currentEmployee.value = employee;
  isModalOpen.value = true;
};

const fetchEmployees = async () => {
  try {
    isLoading.value = true;
    await employeesStore.filter();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped></style>
