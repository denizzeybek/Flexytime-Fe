<template>
  <DataTable
    v-model:filters="filters"
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : titles"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50]"
  >
    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" :placeholder="t('common.search.placeholder')" />
        </IconField>
      </div>
    </template>
    <template #empty>
      <div class="w-full flex justify-center py-8">
        <FText>{{ t('pages.hrSettings.teamsAndTitles.titles.table.empty') }}</FText>
      </div>
    </template>
    <Column sortable field="Name" :header="t('pages.hrSettings.teamsAndTitles.titles.table.columns.name')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <i class="pi pi-id-card text-primary" />
          <FText>{{ slotProps.data.Name }}</FText>
        </div>
      </template>
    </Column>
    <Column :header="t('pages.hrSettings.teamsAndTitles.titles.table.columns.actions')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="5rem" />
        <OptionsDropdown
          v-else
          :options="options"
          @optionClick="handleOptionClick($event, slotProps.data)"
        />
      </template>
    </Column>

    <template #footer>
      <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
        <Button icon="pi pi-plus" :label="t('pages.hrSettings.teamsAndTitles.titles.addButton')" class="shadow-sm" @click="handleNew" />
        <FText>{{ t('pages.hrSettings.teamsAndTitles.titles.footer', { count: titles.length }) }}</FText>
      </div>
    </template>
  </DataTable>

  <TitleModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentTitle"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { FilterMatchMode } from '@primevue/core/api';
import Skeleton from 'primevue/skeleton';
import { useConfirm } from 'primevue/useconfirm';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { useFToast } from '@/composables/useFToast';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { createSkeletonData } from '@/helpers/skeleton';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsTitlesStore } from '@/stores/hrSettings/titles';

import TitleModal from './_modals/TitleModal.vue';

import type { TitleListItem } from '@/stores/hrSettings/titles';

const { t } = useI18n<{ message: MessageSchema }>();
const { showErrorMessage } = useFToast();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const confirm = useConfirm();
const titlesStore = useHRSettingsTitlesStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const currentTitle = ref<TitleListItem>();
const isModalOpen = ref(false);

const isLoading = computed(() => titlesStore.isLoading);
const titles = computed(() => titlesStore.list);

const options = computed(() => [
  {
    label: t('common.actions.edit'),
    icon: 'pi pi-pencil',
    value: EOptionsDropdown.Edit,
  },
  {
    label: t('common.actions.delete'),
    icon: 'pi pi-trash',
    value: EOptionsDropdown.Delete,
  },
]);

const handleNew = async () => {
  currentTitle.value = undefined;
  await nextTick();
  isModalOpen.value = true;
};

const handleEdit = (title: TitleListItem) => {
  currentTitle.value = title;
  isModalOpen.value = true;
};

const handleDelete = (titleId: string) => {
  confirm.require({
    message: t('common.confirmDelete'),
    header: t('common.confirmation'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: t('common.buttons.yes'),
    rejectLabel: t('common.buttons.no'),
    accept: async () => {
      await executeWithFeedback(
        () => titlesStore.deleteTitle(titleId),
        t('pages.hrSettings.teamsAndTitles.titles.messages.deleted'),
      );
    },
  });
};

const handleOptionClick = (option: EOptionsDropdown, title: TitleListItem) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(title);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(title.ID!);
  }
};

const fetchTitles = async () => {
  try {
    await titlesStore.fetchTitles();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const skeletonData = createSkeletonData(5, {
  Name: '',
});

onMounted(() => {
  fetchTitles();
});
</script>
