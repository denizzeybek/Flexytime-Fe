<template>
  <EmployeesTable
    :is-loading="isLoading"
    @new="handleNew"
    @edit="handleEdit"
    @fetch-employees="fetchEmployees"
  />
  <EmployeeModal v-if="isModalOpen" v-model:open="isModalOpen" :data="currentEmployee" />
</template>

<script setup lang="ts">
import EmployeesTable from './EmployeesTable.vue';
import { onMounted, ref } from 'vue';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/employees';
import { useFToast } from '@/composables/useFToast';
import EmployeeModal from './_modals/EmployeeModal.vue';

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
