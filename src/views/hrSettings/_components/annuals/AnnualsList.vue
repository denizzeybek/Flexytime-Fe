<template>
  <AnnualsTable
    :is-loading="isLoading"
    @new="handleNew"
    @edit="handleEdit"
  />
  <AnnualModal v-if="isModalOpen" v-model:open="isModalOpen" :data="currentAnnual" />
</template>

<script setup lang="ts">
import AnnualsTable from './AnnualsTable.vue';
import { onMounted, ref } from 'vue';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';
import { useFToast } from '@/composables/useFToast';
import AnnualModal from './_modals/AnnualModal.vue';

const annualsStore = useHRSettingsAnnualsStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const isModalOpen = ref(false);
const currentAnnual = ref();

const handleNew = () => {
  isModalOpen.value = true;
  currentAnnual.value = undefined;
};

const handleEdit = (annual) => {
  currentAnnual.value = annual;
  isModalOpen.value = true;
};

const fetchAnnuals = async () => {
  try {
    isLoading.value = true;
    await annualsStore.filter();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  fetchAnnuals();
});
</script>

<style scoped></style>
