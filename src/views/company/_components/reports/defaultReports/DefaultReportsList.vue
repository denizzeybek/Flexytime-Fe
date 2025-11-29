<template>
  <DefaultReportsTable :is-loading="isLoading" @new="handleNew" @edit="handleEdit" @delete="handleDelete" />
  <DefaultReportModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentReport"
    @fetch-default-reports="fetchDefaultReports"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';

import type { ReportViewModel } from '@/client';

import DefaultReportModal from '../_modals/DefaultReportModal.vue';

import DefaultReportsTable from './DefaultReportsTable.vue';

const { t } = useI18n<{ message: MessageSchema }>();
const reportsStore = useCompanyReportsStore();
const { showSuccessMessage, showErrorMessage } = useFToast();

const isLoading = ref(false);
const isModalOpen = ref(false);
const currentReport = ref<ReportViewModel>();

const handleNew = () => {
  isModalOpen.value = true;
  currentReport.value = undefined;
};

const handleEdit = (report: ReportViewModel) => {
  currentReport.value = report;
  isModalOpen.value = true;
};

const handleDelete = async (id: string) => {
  try {
    await reportsStore.deleteReport(id);
    showSuccessMessage(t('pages.company.reports.defaultReports.messages.deleted'));
  } catch (error) {
    showErrorMessage(error as any);
  }
};

const fetchDefaultReports = async () => {
  try {
    isLoading.value = true;
    await reportsStore.fetchDefaultReports();
  } catch (error) {
    showErrorMessage(error as any);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDefaultReports();
});
</script>

<style scoped></style>
