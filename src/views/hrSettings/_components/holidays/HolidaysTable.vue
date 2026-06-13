<template>
  <DataTable
    v-model:filters="filters"
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : holidays"
    :rows="5"
    :rowsPerPageOptions="[5, 10, 20, 50]"
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
          <FText>{{ slotProps.data.Name }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="Days" :header="t('pages.hrSettings.holidays.table.columns.days')"> </Column>
    <Column sortable field="Start" :header="t('pages.hrSettings.holidays.table.columns.startDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ formatDate(slotProps.data.Start, slotProps.data.StartFullDay) }}</FText>
          <FText v-if="!slotProps.data.StartFullDay">{{ formatTime(slotProps.data.Start) }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="End" :header="t('pages.hrSettings.holidays.table.columns.endDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ formatDate(slotProps.data.End, slotProps.data.EndFullDay) }}</FText>
          <FText v-if="!slotProps.data.EndFullDay">{{ formatTime(slotProps.data.End) }}</FText>
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
        <Button icon="pi pi-plus" :label="t('pages.hrSettings.holidays.table.addButton')" class="shadow-sm" @click="emit('new')" />
        <FText>{{ t('pages.hrSettings.holidays.table.totalCount', { count: holidays ? holidays.length : 0 }) }}</FText>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed,ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { FilterMatchMode } from '@primevue/core/api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Skeleton from 'primevue/skeleton';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';

defineProps<IProps>();

const emit = defineEmits<IEmits>();

dayjs.extend(utc);

const formatDate = (iso: string | undefined, fullDay: boolean | undefined): string => {
  if (!iso) return '';
  return fullDay ? dayjs(iso).utc().format('DD.MM.YYYY') : dayjs(iso).format('DD.MM.YYYY');
};
const formatTime = (iso: string | undefined): string => {
  if (!iso) return '';
  return dayjs(iso).format('HH:mm');
};
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { createSkeletonData } from '@/helpers/skeleton';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';

import type { HolidayDto } from '@/client';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: HolidayDto): void;
  (event: 'delete', ID: string): void;
}

const { t } = useI18n<{ message: MessageSchema }>();

const holidaysStore = useHRSettingsHolidaysStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Days: { value: null, matchMode: FilterMatchMode.EQUALS },
  Start: { value: null, matchMode: FilterMatchMode.CONTAINS },
  End: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

const handleEdit = (holiday: HolidayDto) => {
  emit('edit', holiday);
};

const handleDelete = async (ID: string) => {
  emit('delete', ID);
};

const handleOptionClick = (option: EOptionsDropdown, holiday: HolidayDto) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(holiday);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(holiday.ID!);
  }
};

const skeletonData = createSkeletonData(5, {
  Name: '',
  Days: '',
  Start: '',
  End: '',
  StartFullDay: true,
  EndFullDay: true,
});
</script>
