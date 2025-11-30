<template>
    <CompaniesTable
      :is-loading="isLoading"
      @new="handleNew"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <CompanyModal v-if="isModalOpen" v-model:open="isModalOpen" :data="currentCompany" />
  </template>
  
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useSettingsCompaniesStore } from '@/stores/settings/companies';

import CompanyModal from './_modals/CompanyModal.vue';
import CompaniesTable from './CompaniesTable.vue';

import type { CompanyViewModel } from '@/client';

const companiesStore = useSettingsCompaniesStore();
const { showErrorMessage } = useFToast();

const isLoading = computed(() => companiesStore.isLoading);

const currentCompany = ref<CompanyViewModel>();
const isModalOpen = ref(false);

const handleNew = () => {
  currentCompany.value = undefined;
  isModalOpen.value = true;
};

const handleEdit = (company: CompanyViewModel) => {
  currentCompany.value = company;
  isModalOpen.value = true;
};

const handleDelete = async (ID: string) => {
  try {
    await companiesStore.deleteCompany(ID);
    await fetchCompanies();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const fetchCompanies = async () => {
  try {
    await companiesStore.filter();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};
  
  onMounted(() => {
    fetchCompanies();
  });
  </script>
  
  <style scoped></style>
  