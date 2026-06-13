<template>
  <DataTable
    v-model:filters="filters"
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : companies"
    :rows="5"
    :rowsPerPageOptions="[5, 10, 20, 50]"
  >
    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" :placeholder="t('pages.settings.companies.table.search')" />
        </IconField>
      </div>
    </template>
    <template #empty>
      <div class="w-full flex justify-center py-8">
        <FText>{{ t('pages.settings.companies.table.empty') }}</FText>
      </div>
    </template>
    <Column sortable field="Name" :header="t('pages.settings.companies.table.columns.name')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <FAvatar :label="slotProps.data.Name" />
          <FText>{{ slotProps.data.Name }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="Fullname" :header="t('pages.settings.companies.table.columns.fullName')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Fullname }}</FText>
      </template>
    </Column>
    <Column sortable field="Email" :header="t('pages.settings.companies.table.columns.email')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Email }}</FText>
      </template>
    </Column>
    <Column sortable field="UserCount" :header="t('pages.settings.companies.table.columns.userCount')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.UserCount ?? '-' }}</FText>
      </template>
    </Column>
    <Column sortable field="Month" :header="t('pages.settings.companies.table.columns.month')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Month ?? '-' }}</FText>
      </template>
    </Column>
    <Column sortable field="CreateDate" :header="t('pages.settings.companies.table.columns.createDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.CreateDate || '-' }}</FText>
      </template>
    </Column>
    <Column field="LastActivityDate" :header="t('pages.settings.companies.table.columns.lastActivityDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.LastActivityDate || '-' }}</FText>
      </template>
    </Column>
    <Column sortable field="DashboardActivityDate" :header="t('pages.settings.companies.table.columns.dashboardActivityDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.DashboardActivityDate || '-' }}</FText>
      </template>
    </Column>
    <Column field="LicenseExpireDate" :header="t('pages.settings.companies.table.columns.license')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <FText v-else>{{ formatLicense(slotProps.data) }}</FText>
      </template>
    </Column>
    <Column :header="t('pages.settings.companies.table.columns.actions')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" shape="circle" height="1.5rem" width="10rem" />
        <OptionsDropdown
          v-else
          :options="options"
          @optionClick="handleOptionClick($event, slotProps.data)"
        />
      </template>
    </Column>

    <template #footer>
      <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
        <Button icon="pi pi-plus" :label="t('pages.settings.companies.table.addButton')" class="shadow-sm" @click="emit('new')" />
        <FText>{{ t('pages.settings.companies.table.totalCount', { count: companies ? companies.length : 0 }) }}</FText>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { FilterMatchMode } from '@primevue/core/api';
import Skeleton from 'primevue/skeleton';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { createSkeletonData } from '@/helpers/skeleton';
import { type MessageSchema } from '@/plugins/i18n';
import { useSettingsCompaniesStore } from '@/stores/settings/companies';

import type { CompanyViewModel } from '@/client';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: CompanyViewModel): void;
  (event: 'delete', value: string): void;
}

defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const companiesStore = useSettingsCompaniesStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  Fullname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  Email: { value: null, matchMode: FilterMatchMode.IN },
  UserCount: { value: null, matchMode: FilterMatchMode.EQUALS },
  Month: { value: null, matchMode: FilterMatchMode.EQUALS },
  CreateDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  LastActivityDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  DashboardActivityDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  LicenseExpireDate: { value: null, matchMode: FilterMatchMode.EQUALS },
});

/**
 * Display the v2 license as the legacy summary string. BE now ships
 * `ActiveUserCount` / `UserCount` / `LicenseExpireDate` as raw fields so
 * the network response is self-explanatory; this composer matches the
 * legacy "{active}/{cap} kullanıcı {expire:dd.MM.yyyy}" the operations
 * team is used to reading.
 */
const formatLicense = (row: CompanyViewModel): string => {
  const active = row.ActiveUserCount ?? 0;
  const cap = row.UserCount ?? 0;
  if (!row.LicenseExpireDate) return `${active}/${cap} kullanıcı -`;
  const d = new Date(row.LicenseExpireDate);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${active}/${cap} kullanıcı ${dd}.${mm}.${yyyy}`;
};

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

const companies = computed(() => {
  return companiesStore.list;
});

const handleEdit = (company: CompanyViewModel) => {
  emit('edit', company);
};

const handleDelete = (company: CompanyViewModel) => {
  emit('delete', company.ID!);
};

const handleOptionClick = (option: EOptionsDropdown, company: CompanyViewModel) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(company);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(company);
  }
};

const skeletonData = createSkeletonData(5, {
  Name: '',
  Fullname: '',
  Email: '',
  Password: null as string | null,
  UserCount: 0,
  ActiveUserCount: 0,
  Month: 0,
  LicenseExpireDate: null as string | null,
  CreateDate: '',
  LastActivityDate: null as string | null,
  DashboardActivityDate: null as string | null,
});
</script>

<style scoped></style>
