<template>
  <WebAddressesTable
    :is-loading="isLoading"
    @onPageChange="handlePageChange"
    @onSortChange="handleSortChange"
  />
  <Teleport v-if="isOnMounted" to="#table-search">
    <InputText v-model.lazy="searchText" :placeholder="t('pages.classification.search.placeholder')"/>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import InputText from 'primevue/inputtext';

import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses';

import WebAddressesTable from './WebAddressesTable.vue';

const { t } = useI18n<{ message: MessageSchema }>();

const webAddressesStore = useClassificationWebAddressesStore();
const { showErrorMessage } = useFToast();
const { isLoading, executeAsync } = useAsyncLoading();

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
    await executeAsync(() => webAddressesStore.filter(payload.value));
  } catch (error) {
    showErrorMessage(error as Error);
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
