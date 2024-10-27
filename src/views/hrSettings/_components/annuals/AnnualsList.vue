<template>
  <AnnualsTable :is-loading="isLoading" @new="handleNew" @edit="handleEdit" />
  <AnnualModal v-if="isAnnualModalOpen" v-model:open="isAnnualModalOpen" :data="currentAnnual" />
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
const isAnnualModalOpen = ref(false);
const currentAnnual = ref();

const fetchAnnuals = async () => {
  try {
    isLoading.value = true;
    await annualsStore.filter();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

const handleNew = () => {
  isAnnualModalOpen.value = true;
};

const handleEdit = (annual) => {
  currentAnnual.value = annual;
  isAnnualModalOpen.value = true;
};

onMounted(() => {
  fetchAnnuals();
});
</script>

<style scoped></style>
