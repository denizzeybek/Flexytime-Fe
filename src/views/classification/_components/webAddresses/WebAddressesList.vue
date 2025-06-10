<template>
  <WebAddressesTable :is-loading="isLoading" />
</template>

<script setup lang="ts">
import WebAddressesTable from './WebAddressesTable.vue';
import { onMounted, ref } from 'vue';
import { useFToast } from '@/composables/useFToast';
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses';

const webAddressesStore = useClassificationWebAddressesStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);

const fetchWebAddresses = async () => {
  try {
    isLoading.value = true;
    const payload = {
      start: 1,
      length: 9999999,
      search: '',
      sort: '',
      descending: false,
    };
    await webAddressesStore.filter(payload);
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  fetchWebAddresses();
});
</script>

<style scoped></style>
