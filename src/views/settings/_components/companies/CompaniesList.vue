<template>
    <CompaniesTable
      :is-loading="isLoading"
      @new="handleNew"
      @edit="handleEdit"
    />
    <CompanyModal v-if="isModalOpen" v-model:open="isModalOpen" :data="currentCompany" />
  </template>
  
  <script setup lang="ts">
  import CompaniesTable from './CompaniesTable.vue';
  import { onMounted, ref } from 'vue';
  import { useSettingsCompaniesStore } from '@/stores/settings/companies';
  import { useFToast } from '@/composables/useFToast';
  import CompanyModal from './_modals/CompanyModal.vue';
  
  const companiesStore = useSettingsCompaniesStore();
  const { showErrorMessage } = useFToast();
  
  const isLoading = ref(false);
  const currentCompany = ref();
  const isModalOpen = ref(false);
  
  const handleNew = () => {
    currentCompany.value = undefined;
    isModalOpen.value = true;
  };

  const handleEdit = (company) => {
    currentCompany.value = company;
    isModalOpen.value = true;
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
  