<template>
  <div>
    <EmployeesTable :isLoading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import EmployeesTable from './EmployeesTable.vue';
import { onMounted, ref } from 'vue';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/employees';
import { useFToast } from '@/composables/useFToast';

const employeesStore = useHRSettingsEmployeesStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);

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
  // fetchEmployees()
});
</script>

<style scoped></style>
