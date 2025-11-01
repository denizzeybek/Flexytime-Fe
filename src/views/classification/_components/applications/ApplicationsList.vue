<template>
  <ApplicationsTable
    :is-loading="isLoading"
    @onPageChange="handlePageChange"
    @onSortChange="handleSortChange"
  />
  <Teleport v-if="isOnMounted" to="#table-search">
    <InputText v-model.lazy="searchText" :placeholder="t('pages.classification.search.placeholder')" />
  </Teleport>
</template>

<script setup lang="ts">
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useFToast } from '@/composables/useFToast';
import { useClassificationApplicationsStore } from '@/stores/classification/applications';
import { onMounted, ref, watch } from 'vue';
import ApplicationsTable from './ApplicationsTable.vue';
import InputText from 'primevue/inputtext';

const { t } = useI18n<{ message: MessageSchema }>();

const applicationsStore = useClassificationApplicationsStore();
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


const fetchApplications = async () => {
  try {
    isLoading.value = true;
    await applicationsStore.filter(payload.value);
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
  fetchApplications();
};

const handleSortChange = (sortField) => {
  payload.value = {
    ...payload.value,
    sort: sortField,
    descending: !payload.value.descending,
  };
  fetchApplications();
};

watch(
  () => searchText.value,
  (search) => {
    payload.value.search = search;
    fetchApplications();
  },
);

onMounted(() => {
  isOnMounted.value = true;
  fetchApplications();
});
</script>

<style scoped></style>
