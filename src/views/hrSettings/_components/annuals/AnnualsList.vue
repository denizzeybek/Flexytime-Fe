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
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';

import AnnualModal from './_modals/AnnualModal.vue';
import AnnualsTable from './AnnualsTable.vue';

import type { AnnualViewModel } from '@/client';

const annualsStore = useHRSettingsAnnualsStore();
const { showErrorMessage } = useFToast();

const isLoading = computed(() => annualsStore.isLoading);

const isModalOpen = ref(false);
const currentAnnual = ref<AnnualViewModel>();

const handleNew = () => {
  isModalOpen.value = true;
  currentAnnual.value = undefined;
};

const handleEdit = (annual: AnnualViewModel) => {
  currentAnnual.value = annual;
  isModalOpen.value = true;
};

const handleDelete = async (ID: string) => {
  try {
    await annualsStore.delete({ ID });
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const fetchAnnuals = async () => {
  try {
    await annualsStore.filter();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

onMounted(() => {
  fetchAnnuals();
});
</script>

<style scoped></style>
