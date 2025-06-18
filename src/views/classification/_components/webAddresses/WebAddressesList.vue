<template>
  <WebAddressesTable
    :is-loading="isLoading"
    @onPageChange="handlePageChange"
    @onSortChange="handleSortChange"
  />
  <Teleport v-if="isOnMounted" to="#table-search">
    <InputText v-model.lazy="searchText" placeholder="Search"/>
  </Teleport>
</template>

<script setup lang="ts">
import WebAddressesTable from './WebAddressesTable.vue';
import { onMounted, ref, watch } from 'vue';
import { useFToast } from '@/composables/useFToast';
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses';
import InputText from 'primevue/inputtext';

const webAddressesStore = useClassificationWebAddressesStore();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const searchText = ref('');
const isOnMounted = ref(false);
const payload = ref({
  start: 1,
  length: 10,
  search: '',
  sort: '',
  descending: false,
});

const fetchWebAddresses = async () => {
  try {
    isLoading.value = true;
    await webAddressesStore.filter(payload.value);
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

const handlePageChange = ({ offset, rows }) => {
  payload.value = {
    ...payload.value,
    start: offset,
    length: rows,
  };
  fetchWebAddresses();
};

const handleSortChange = (sortField) => {
  payload.value = {
    ...payload.value,
    sort: sortField,
    descending: !payload.value.descending,
  };
  fetchWebAddresses();
};

watch(
  () => searchText.value,
  (search) => {
    payload.value.search = search;
    fetchWebAddresses();
  },
);

onMounted(() => {
  isOnMounted.value = true;
  fetchWebAddresses();
});
</script>

<style scoped></style>
