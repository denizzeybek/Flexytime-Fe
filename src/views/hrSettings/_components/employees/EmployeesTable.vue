<template>
  <DataTable
    v-model:filters="filters"
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : employees"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50]"
  >
    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" :placeholder="t('pages.hrSettings.search.placeholder')" />
        </IconField>
      </div>
    </template>
    <template #empty>
      <div class="w-full flex justify-center py-8">
        <FText>{{ t('pages.hrSettings.employees.table.empty') }}</FText>
      </div>
    </template>
    <Column sortable field="MemberName" :header="t('pages.hrSettings.employees.table.columns.name')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <FAvatar :label="slotProps.data.MemberName" />
          <FText>{{ slotProps.data.MemberName }}</FText>
        </div>
      </template>
    </Column>
    <Column sortable field="RoleName" :header="t('pages.hrSettings.employees.table.columns.roleName')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.RoleName }}</FText>
      </template>
    </Column>
    <Column field="Tags" :header="t('pages.hrSettings.employees.table.columns.tags')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else-if="slotProps.data.Tags?.length" class="flex flex-col gap-1">
          <div v-for="(tag, idx) in slotProps.data.Tags" :key="idx">
            <Tag :value="tag" />
          </div>
        </div>
        <div v-else></div>
      </template>
    </Column>
    <Column sortable field="TitleName" :header="t('pages.hrSettings.employees.table.columns.titleName')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.TitleName }}</FText>
      </template>
    </Column>
    <Column sortable field="TeamName" :header="t('pages.hrSettings.employees.table.columns.teamName')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.TeamName }}</FText>
      </template>
    </Column>
    <Column field="Salary" :header="t('pages.hrSettings.employees.table.columns.salary')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Salary }}</FText>
      </template>
    </Column>
    <Column :header="t('pages.hrSettings.employees.table.columns.enabled')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <Checkbox
          v-else
          :modelValue="slotProps.data.Enabled"
          :binary="true"
          @change="
            handleAlwaysOnChange({
              props: slotProps.data.ID,
              alwaysOn: !slotProps.data.Enabled,
            })
          "
        />
      </template>
    </Column>
    <Column :header="t('pages.hrSettings.employees.table.columns.actions')">
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
        <Button icon="pi pi-plus" :label="t('pages.hrSettings.employees.table.addUser')" class="shadow-sm" @click="emit('new')" />
        <FText> {{ t('pages.hrSettings.employees.table.totalText', { count: employees ? employees.length : 0 }) }} </FText>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed,ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { FilterMatchMode } from '@primevue/core/api';
import Checkbox from 'primevue/checkbox';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/employees';

import type { IEmployeeMember } from '@/interfaces/hrSettings/employee';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: IEmployeeMember): void;
}

defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const employeesStore = useHRSettingsEmployeesStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  MemberName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  RoleName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  Tags: { value: null, matchMode: FilterMatchMode.IN },
  TitleName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  TeamName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  Salary: { value: null, matchMode: FilterMatchMode.EQUALS },
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

const employees = computed(() => {
  return employeesStore.list;
});

const handleAlwaysOnChange = async (event) => {
  try {
    const { props: employeeID, alwaysOn } = event;
    const payload = {
      ID: employeeID,
      Enabled: alwaysOn,
    };
    console.log(payload);
    // TODO: Implement update employee enabled status
    // await employeesStore.updateEnabled(payload);
  } catch (error) {
    console.error('Error updating employee status:', error);
  }
};

const handleEdit = (employee: IEmployeeMember) => {
  emit('edit', employee);
};

const handleDelete = (employeeID: string) => {
  console.log('employeeID ', employeeID);
  // employeesStore.deleteEmployee(employeeID);
};

const handleOptionClick = (option: EOptionsDropdown, employee: IEmployeeMember) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(employee);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(employee.ID);
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  MemberName: '',
  RoleName: '',
  Tags: [],
  TitleName: '',
  TeamName: '',
  Salary: '',
  Enabled: false,
}));
</script>

<style scoped></style>
