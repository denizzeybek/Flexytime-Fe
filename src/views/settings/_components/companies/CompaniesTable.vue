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
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </IconField>
      </div>
    </template>
    <template #empty>
      <div class="w-full flex justify-center py-8">
        <FText>No company found.</FText>
      </div>
    </template>
    <Column sortable field="Name" header="Name">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <FAvatar :label="slotProps.data.Name" />
          <FText>{{ slotProps.data.Name }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="Fullname" header="Full Name">
      <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
    </Column>
    <Column sortable field="Email" header="Email">
      <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
    </Column>
    <Column sortable field="CreateDate" header="Create Date">
      <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
    </Column>
    <Column field="LastActivityDate" header="Last Activity Date">
      <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
    </Column>
    <Column field="DashboardActivityDate" header="Dashboard Activity Date">
      <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
    </Column>
    <Column field="License" header="License">
      <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
    </Column>
    <Column header="Actions">
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
        <Button icon="pi pi-plus" label="Add Company" @click="emit('new')" class="shadow-sm" />
        <FText> In total there are {{ companies ? companies.length : 0 }} companies. </FText>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Skeleton from 'primevue/skeleton';
import { useSettingsCompaniesStore } from '@/stores/settings/companies';
import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import type { ICompany } from '@/interfaces/settings/company';
import { FilterMatchMode } from '@primevue/core/api';

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
    label: 'Edit',
    icon: 'pi pi-pencil',
    value: EOptionsDropdown.Edit,
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    value: EOptionsDropdown.Delete,
  },
]);

const companies = computed(() => {
  return companiesStore.list;
});

const handlePage = (e) => {
  console.log('e ', e);
};

// const handleAlwaysOnChange = async (event) => {
//   try {
//     const { props, alwaysOn } = event;
//     const { ID, Name, Domain } = props;
//     const payload = {
//       ID,
//       Name,
//       Domain,
//       AlwaysOn: alwaysOn,
//     };
//     console.log(payload);

//     // await companiesStore.update()
//   } catch (error) {
//     console.log(error);
//   }
// };

const handleEdit = (employee: ICompany) => {
  emit('edit', employee);
};

const handleDelete = (employeeID: string) => {
  console.log(employeeID);
  // companiesStore.deleteEmployee(employeeID);
};

const handleOptionClick = (option: EOptionsDropdown, employee: ICompany) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(employee);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(employee.ID);
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  HostName: '',
  TopicName: '',
  Teams: '',
  AlwaysOn: false,
}));
</script>

<style scoped></style>
