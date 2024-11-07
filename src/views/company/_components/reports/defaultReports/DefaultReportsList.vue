<template>
  <DefaultReportsTable :is-loading="isLoading" @new="handleNew" @edit="handleEdit" />
  <DefaultReportModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentReport"
    @fetch-default-reports="fetchDefaultReports"
  />
</template>

<script setup lang="ts">
import { useFToast } from '@/composables/useFToast';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { onMounted, ref } from 'vue';
import DefaultReportsTable from './DefaultReportsTable.vue';
import DefaultReportModal from '../_modals/DefaultReportModal.vue';

const reportsStore = useCompanyReportsStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const isModalOpen = ref(false);
const currentReport = ref();

const handleNew = () => {
  isModalOpen.value = true;
  currentReport.value = undefined;
};

const handleEdit = (annual) => {
  currentReport.value = annual;
  isModalOpen.value = true;
};

const fetchDefaultReports = async () => {
  try {
    isLoading.value = true;
    await reportsStore.fetchDefaultReports();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  fetchDefaultReports();
});
</script>

<style scoped></style>
