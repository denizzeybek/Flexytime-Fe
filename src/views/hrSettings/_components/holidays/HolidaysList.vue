<template>
  <HolidaysTable
    :is-loading="isLoading"
    @new="handleNew"
    @edit="handleEdit"
    @delete="handleDelete"
  />
  <HolidayModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentHoliday"
    @fetchHolidays="fetchHolidays"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';

import HolidayModal from './_modals/HolidayModal.vue';
import HolidaysTable from './HolidaysTable.vue';

const holidaysStore = useHRSettingsHolidaysStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const isModalOpen = ref(false);
const currentHoliday = ref();

const handleNew = () => {
  isModalOpen.value = true;
  currentHoliday.value = undefined;
};

const handleEdit = (annual) => {
  currentHoliday.value = annual;
  isModalOpen.value = true;
};

const handleDelete = async (ID) => {
  try {
    await holidaysStore.delete({ ID: ID });
    await fetchHolidays();
  } catch (error) {
    console.error(error);
  }
};

const fetchHolidays = async () => {
  try {
    isLoading.value = true;
    await holidaysStore.filter();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  fetchHolidays();
});
</script>

<style scoped></style>
