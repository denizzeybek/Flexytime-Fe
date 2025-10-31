<template>
  <DataTable
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : companies"
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
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <FAvatar :label="slotProps.data.Name" />
          <FText>{{ slotProps.data.Name }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="Fullname" :header="t('pages.settings.companies.table.columns.fullName')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Fullname }}</FText>
      </template>
    </Column>
    <Column sortable field="Email" :header="t('pages.settings.companies.table.columns.email')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Email }}</FText>
      </template>
    </Column>
    <Column sortable field="CreateDate" :header="t('pages.settings.companies.table.columns.createDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.CreateDate }}</FText>
      </template>
    </Column>
    <Column field="LastActivityDate" :header="t('pages.settings.companies.table.columns.lastActivityDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.LastActivityDate || '-' }}</FText>
      </template>
    </Column>
    <Column field="DashboardActivityDate" :header="t('pages.settings.companies.table.columns.dashboardActivityDate')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.DashboardActivityDate || '-' }}</FText>
      </template>
    </Column>
    <Column field="License" :header="t('pages.settings.companies.table.columns.license')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.License }}</FText>
      </template>
    </Column>
    <Column :header="t('pages.settings.companies.table.columns.actions')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <OptionsDropdown
          v-else
          :options="options"
          @optionClick="handleOptionClick($event, slotProps.data)"
        />
      </template>
    </Column>

    <template #footer>
      <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
        <Button icon="pi pi-plus" :label="t('pages.settings.companies.table.addButton')" @click="emit('new')" class="shadow-sm" />
        <FText>{{ t('pages.settings.companies.table.totalCount', { count: companies ? companies.length : 0 }) }}</FText>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Skeleton from 'primevue/skeleton';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useSettingsCompaniesStore } from '@/stores/settings/companies';
import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import type { ICompany } from '@/interfaces/settings/company';
import { FilterMatchMode } from '@primevue/core/api';

const { t } = useI18n<{ message: MessageSchema }>();

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: ICompany): void;
}

const emit = defineEmits<IEmits>();

const companiesStore = useSettingsCompaniesStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  Fullname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  Email: { value: null, matchMode: FilterMatchMode.IN },
  CreateDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  LastActivityDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  DashboardActivityDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  License: { value: null, matchMode: FilterMatchMode.EQUALS },
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

const companies = computed(() => {
  return companiesStore.list;
});

const handlePage = (e) => {
  console.log(e);
  // Handle pagination if needed
};

const handleEdit = (company: ICompany) => {
  emit('edit', company);
};

const handleDelete = (companyID: string) => {
  // TODO: Implement delete functionality
  console.log(companyID);
  // companiesStore.deleteCompany(companyID);
};

const handleOptionClick = (option: EOptionsDropdown, company: ICompany) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(company);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(company.ID);
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  Name: '',
  Fullname: '',
  Email: '',
  Password: null,
  UserCount: 0,
  Month: 0,
  License: '',
  CreateDate: '',
  LastActivityDate: null,
  DashboardActivityDate: null,
}));
</script>

<style scoped></style>
