<template>
  <div>
    <ActiveAnnualsTable :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import ActiveAnnualsTable from './ActiveAnnualsTable.vue';
import { onMounted, ref } from 'vue';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';
import { useFToast } from '@/composables/useFToast';

const annualsStore = useHRSettingsAnnualsStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);

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
  fetchAnnuals()
});
</script>

<style scoped></style>
