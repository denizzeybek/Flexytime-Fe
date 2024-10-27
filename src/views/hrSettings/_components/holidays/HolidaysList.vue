<template>
  <HolidaysTable :is-loading="isLoading" @new="handleNew" @edit="handleEdit" @fetch-holidays="fetchHolidays"/>
  <HolidayModal v-if="isModalOpen" v-model:open="isModalOpen" :data="currentHoliday" />
</template>

<script setup lang="ts">
import HolidaysTable from './HolidaysTable.vue';
import { onMounted, ref } from 'vue';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';
import { useFToast } from '@/composables/useFToast';
import HolidayModal from './_modals/HolidayModal.vue';

const holidaysStore = useHRSettingsHolidaysStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const isModalOpen = ref(false);
const currentHoliday = ref();

const handleNew = () => {
  isModalOpen.value = true;
};

const handleEdit = (annual) => {
  currentHoliday.value = annual;
  isModalOpen.value = true;
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
