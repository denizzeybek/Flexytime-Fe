<template>
  <WebAddressesTable :is-loading="isLoading" />
</template>

<script setup lang="ts">
import WebAddressesTable from './WebAddressesTable.vue';
import { onMounted, ref } from 'vue';
import { useFToast } from '@/composables/useFToast';
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses';
import type { IWebaddressDTOPayload } from '@/interfaces/classification/webAddress';

const webAddressesStore = useClassificationWebAddressesStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);

const fetchWebAddresses = async () => {
  try {
    isLoading.value = true;
    const payload = {
      descending: false,
      length: 5,
      search: '',
      sort: '',
      start: 1,
    } as IWebaddressDTOPayload;
    await webAddressesStore.filter(payload);
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  // fetchWebAddresses()
});
</script>

<style scoped></style>
