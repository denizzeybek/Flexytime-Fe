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
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';

import HolidayModal from './_modals/HolidayModal.vue';
import HolidaysTable from './HolidaysTable.vue';

import type { HolidayViewModel } from '@/client';

const holidaysStore = useHRSettingsHolidaysStore();
const { showErrorMessage } = useFToast();

const isModalOpen = ref(false);
const currentHoliday = ref<HolidayViewModel>();

const isLoading = computed(() => holidaysStore.isLoading);

const handleNew = () => {
  isModalOpen.value = true;
  currentHoliday.value = undefined;
};

const handleEdit = (holiday: HolidayViewModel) => {
  currentHoliday.value = holiday;
  isModalOpen.value = true;
};

const handleDelete = async (ID: string) => {
  try {
    await holidaysStore.delete({ ID });
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const fetchHolidays = async () => {
  try {
    await holidaysStore.filter();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

onMounted(() => {
  fetchHolidays();
});
</script>

<style scoped></style>
