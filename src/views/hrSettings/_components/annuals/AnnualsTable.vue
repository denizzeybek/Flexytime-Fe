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
    <Column sortable field="StartDate" :header="t('pages.hrSettings.annualsTable.columns.startDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ slotProps.data.StartDate }}</FText>
          <FText>{{ slotProps.data.StartTime }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="EndDate" :header="t('pages.hrSettings.annualsTable.columns.endDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex flex-col items-start gap-2">
          <FText>{{ slotProps.data.EndDate }}</FText>
          <FText>{{ slotProps.data.EndTime }}</FText>
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
import Skeleton from 'primevue/skeleton';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';

import type { IAnnual } from '@/interfaces/hrSettings/annual';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: IAnnual): void;
  (event: 'delete', ID: string): void;
}

defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const annualsStore = useHRSettingsAnnualsStore();
const route = useRoute();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  MemberName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  LeaveType: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

const isActiveAnnuals = computed(() => route.name === ERouteNames.HRSettingsActiveAnnuals);

const annuals = computed(() => {
  if (isActiveAnnuals.value) {
    return annualsStore.activeList;
  } else {
    return annualsStore.passiveList;
  }
});

const handleEdit = (annual: IAnnual) => {
  emit('edit', annual);
};

const handleDelete = (ID: string) => {
  emit('delete', ID);
};

const handleOptionClick = (option: EOptionsDropdown, annual: IAnnual) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(annual);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(annual.ID);
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  MemberName: '',
  LeaveType: '',
  Days: '',
  StartDate: '',
  StartTime: '',
  EndDate: '',
  EndTime: '',
}));
</script>
