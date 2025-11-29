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
  import { onMounted, ref } from 'vue';

  import { useFToast } from '@/composables/useFToast';
  import { useSettingsCompaniesStore } from '@/stores/settings/companies';

  import CompanyModal from './_modals/CompanyModal.vue';
  import CompaniesTable from './CompaniesTable.vue';

  import type { ICompany } from '@/interfaces/settings/company';
  
  const companiesStore = useSettingsCompaniesStore();
  const { showErrorMessage } = useFToast();
  
  const isLoading = ref(false);
  const currentCompany = ref();
  const isModalOpen = ref(false);
  
  const handleNew = () => {
    currentCompany.value = undefined;
    isModalOpen.value = true;
  };

  const handleEdit = (company: ICompany) => {
    currentCompany.value = company;
    isModalOpen.value = true;
  };

  const handleDelete = async (ID: string) => {
    try {
      await companiesStore.deleteCompany(ID);
      await fetchCompanies();
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchCompanies = async () => {
    try {
      isLoading.value = true;
      await companiesStore.filter();
      isLoading.value = false;
    } catch (error) {
      showErrorMessage(error as any);
    }
  };
  
  onMounted(() => {
    fetchCompanies();
  });
  </script>
  
  <style scoped></style>
  