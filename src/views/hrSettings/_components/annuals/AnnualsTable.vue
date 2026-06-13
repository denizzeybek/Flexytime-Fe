<template>
  <DataTable
    v-model:filters="filters"
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : annuals"
    :rows="5"
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
        <FText>{{ t('pages.hrSettings.annualsTable.emptyMessage') }}</FText>
      </div>
    </template>
    <Column sortable field="MemberName" :header="t('pages.hrSettings.annualsTable.columns.name')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <FAvatar :label="slotProps.data.MemberName" />
          <FText>{{ slotProps.data.MemberName }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="LeaveType" :header="t('pages.hrSettings.annualsTable.columns.leaveType')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.LeaveType }}</FText>
      </template>
    </Column>
    <Column sortable field="Days" :header="t('pages.hrSettings.annualsTable.columns.days')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Days }}</FText>
      </template>
    </Column>
    <Column sortable field="Start" :header="t('pages.hrSettings.annualsTable.columns.startDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ formatDate(slotProps.data.Start, slotProps.data.StartFullDay) }}</FText>
          <FText v-if="!slotProps.data.StartFullDay">{{ formatTime(slotProps.data.Start) }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="End" :header="t('pages.hrSettings.annualsTable.columns.endDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ formatDate(slotProps.data.End, slotProps.data.EndFullDay) }}</FText>
          <FText v-if="!slotProps.data.EndFullDay">{{ formatTime(slotProps.data.End) }}</FText>
        </div>
      </template>
    </Column>
    <Column :header="t('pages.hrSettings.annualsTable.columns.actions')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <OptionsDropdown
          v-else
          :options="options"
          @optionClick="handleOptionClick($event, slotProps.data)"
        />
      </template>
    </Column>

    <template v-if="isActiveAnnuals" #footer>
      <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
        <Button icon="pi pi-plus" :label="t('pages.hrSettings.annualsTable.buttons.addAnnual')" @click="emit('new')" />
        <FText>{{ t('pages.hrSettings.annualsTable.footerText', { count: annuals ? annuals.length : 0 }) }}</FText>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed,ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

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
import { ERouteNames } from '@/router/routeNames.enum';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';

import type { AnnualDto } from '@/client';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: AnnualDto): void;
  (event: 'delete', ID: string): void;
}

const { t } = useI18n<{ message: MessageSchema }>();

const annualsStore = useHRSettingsAnnualsStore();
const route = useRoute();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  MemberName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  LeaveType: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

const isActiveAnnuals = computed(() => route.name === ERouteNames.HRSettingsActiveAnnuals);

const annuals = computed(() => {
  if (isActiveAnnuals.value) {
    return annualsStore.activeList;
  } else {
    return annualsStore.passiveList;
  }
});

const handleEdit = (annual: AnnualDto) => {
  emit('edit', annual);
};

const handleDelete = (ID: string) => {
  emit('delete', ID);
};

const handleOptionClick = (option: EOptionsDropdown, annual: AnnualDto) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(annual);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(annual.ID!);
  }
};

const skeletonData = createSkeletonData(5, {
  MemberName: '',
  LeaveType: '',
  Days: '',
  Start: '',
  End: '',
  StartFullDay: true,
  EndFullDay: true,
});
</script>
