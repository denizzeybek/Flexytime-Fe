<template>
  <AnnualsTable
    :is-loading="isLoading"
    @new="handleNew"
    @edit="handleEdit"
    @delete="handleDelete"
  />
  <AnnualModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentAnnual"
    @fetchAnnuals="fetchAnnuals"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useFToast } from '@/composables/useFToast';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';

import AnnualModal from './_modals/AnnualModal.vue';
import AnnualsTable from './AnnualsTable.vue';

const annualsStore = useHRSettingsAnnualsStore();
const { showErrorMessage } = useFToast();
const { isLoading, executeAsync } = useAsyncLoading();

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

const handleDelete = async (ID) => {
  try {
    await annualsStore.delete({ ID: ID });
    await fetchAnnuals();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const fetchAnnuals = async () => {
  try {
    await executeAsync(() => annualsStore.filter());
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

onMounted(() => {
  fetchAnnuals();
});
</script>

<style scoped></style>
