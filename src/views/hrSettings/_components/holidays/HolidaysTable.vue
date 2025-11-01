<template>
  <DataTable
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : holidays"
    :rows="5"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    v-model:filters="filters"
    @page="handlePage"
  >
    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" :placeholder="t('pages.hrSettings.holidays.table.search')" />
        </IconField>
      </div>
    </template>
    <template #empty>
      <div class="w-full flex justify-center py-8">
        <FText>{{ t('pages.hrSettings.holidays.table.empty') }}</FText>
      </div>
    </template>
    <Column sortable field="Name" :header="t('pages.hrSettings.holidays.table.columns.name')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <FAvatar :label="slotProps.data.Name" />
          <FText>{{ slotProps.data.Name }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="Days" :header="t('pages.hrSettings.holidays.table.columns.days')"> </Column>
    <Column sortable field="StartDate" :header="t('pages.hrSettings.holidays.table.columns.startDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ slotProps.data.StartDate }}</FText>
          <FText>{{ slotProps.data.StartTime }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="EndDate" :header="t('pages.hrSettings.holidays.table.columns.endDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ slotProps.data.EndDate }}</FText>
          <FText>{{ slotProps.data.EndTime }}</FText>
        </div>
      </template>
    </Column>
    <Column :header="t('pages.hrSettings.holidays.table.columns.actions')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" width="2.5rem" height="2.5rem" class="rounded-lg" />
        <OptionsDropdown
          v-else
          :options="options"
          @optionClick="handleOptionClick($event, slotProps.data)"
        />
      </template>
    </Column>

    <template #footer>
      <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
        <Button icon="pi pi-plus" :label="t('pages.hrSettings.holidays.table.addButton')" @click="emit('new')" class="shadow-sm" />
        <FText>{{ t('pages.hrSettings.holidays.table.totalCount', { count: holidays ? holidays.length : 0 }) }}</FText>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Skeleton from 'primevue/skeleton';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';
import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import type { IHoliday } from '@/interfaces/hrSettings/holiday';
import { FilterMatchMode } from '@primevue/core/api';

const { t } = useI18n<{ message: MessageSchema }>();

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: IHoliday): void;
  (event: 'delete', ID: string): void;
}

const emit = defineEmits<IEmits>();

const holidaysStore = useHRSettingsHolidaysStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Days: { value: null, matchMode: FilterMatchMode.EQUALS },
  StartDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  EndDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Salary: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const options = ref([
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

const holidays = computed(() => {
  return holidaysStore.list;
});

const handlePage = (e) => {
  console.log('e ', e);
};

const handleEdit = (holiday: IHoliday) => {
  emit('edit', holiday);
};

const handleDelete = async (ID: string) => {
  emit('delete', ID);
};

const handleOptionClick = (option: EOptionsDropdown, holiday: IHoliday) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(holiday);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(holiday.ID);
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  Name: '',
  Days: '',
  StartDate: '',
  EndDate: '',
}));
</script>
