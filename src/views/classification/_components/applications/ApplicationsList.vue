<template>
  <ApplicationsTable :is-loading="isLoading" />
</template>

<script setup lang="ts">
import { useFToast } from '@/composables/useFToast';
import { useClassificationApplicationsStore } from '@/stores/classification/applications';
import { onMounted, ref } from 'vue';
import ApplicationsTable from './ApplicationsTable.vue';

const applicationsStore = useClassificationApplicationsStore();
const isLoading = ref(false);
const { showErrorMessage } = useFToast();
const fetchApplications = async () => {
  try {
    isLoading.value = true;
    await applicationsStore.filter();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped></style>
