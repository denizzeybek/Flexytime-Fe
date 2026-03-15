<template>
  <div class="flex flex-col gap-4">
    <!-- Warning Banner -->
    <Message v-if="incompleteCount > 0 && !isLoading" severity="warn" class="w-full">
      <div class="flex items-center justify-between w-full">
        <span>{{ t('pages.hrSettings.employees.warning.incomplete', { count: incompleteCount }) }}</span>
        <Button
          :label="t('pages.hrSettings.employees.warning.showIncomplete')"
          size="small"
          text
          @click="activeFilter = 'incomplete'"
        />
      </div>
    </Message>

    <!-- Filter Tabs -->
    <Tabs v-model:value="activeFilter">
      <TabList>
        <Tab value="all">
          <span class="font-medium">{{ t('pages.hrSettings.employees.filter.all') }} ({{ totalCount }})</span>
        </Tab>
        <Tab value="incomplete">
          <span class="font-medium">{{ t('pages.hrSettings.employees.filter.incomplete') }} ({{ incompleteCount }})</span>
        </Tab>
        <Tab value="active">
          <span class="font-medium">{{ t('pages.hrSettings.employees.filter.active') }} ({{ completeCount }})</span>
        </Tab>
      </TabList>
    </Tabs>

    <DataTable
      v-model:filters="filters"
      tableStyle="min-width: 50rem"
      paginator
      :value="isLoading ? skeletonData : filteredEmployees"
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
    <Column field="Status" :header="t('pages.hrSettings.employees.table.columns.status')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="5rem" />
        <Tag
          v-else
          :value="isEmployeeIncomplete(slotProps.data)
            ? t('pages.hrSettings.employees.status.incomplete')
            : t('pages.hrSettings.employees.status.complete')"
          :severity="isEmployeeIncomplete(slotProps.data) ? 'warn' : 'success'"
          :icon="isEmployeeIncomplete(slotProps.data) ? 'pi pi-exclamation-triangle' : 'pi pi-check'"
        />
      </template>
    </Column>
    <Column field="Salary" :header="t('pages.hrSettings.employees.table.columns.salary')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <FText v-else>{{ slotProps.data.Salary }}</FText>
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
          <FText> {{ t('pages.hrSettings.employees.table.totalText', { count: filteredEmployees ? filteredEmployees.length : 0 }) }} </FText>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { FilterMatchMode } from '@primevue/core/api';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import Tag from 'primevue/tag';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { createSkeletonData } from '@/helpers/skeleton';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';

import type { TheMemberViewModel } from '@/client';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: TheMemberViewModel): void;
}

defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
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

const activeFilter = ref<'all' | 'incomplete' | 'active'>('all');

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

// Check if employee is incomplete (missing team or title)
// System Admin (Role 2) doesn't need team/title
const isEmployeeIncomplete = (employee: TheMemberViewModel): boolean => {
  if (employee.Role === 2) return false;
  return !employee.TeamId || !employee.TitleId;
};

const incompleteCount = computed(() =>
  employeesStore.list.filter((emp) => isEmployeeIncomplete(emp)).length,
);

const completeCount = computed(() =>
  employeesStore.list.filter((emp) => !isEmployeeIncomplete(emp)).length,
);

const totalCount = computed(() => employeesStore.list.length);

const filteredEmployees = computed(() => {
  if (activeFilter.value === 'incomplete') {
    return employeesStore.list.filter((emp) => isEmployeeIncomplete(emp));
  }
  if (activeFilter.value === 'active') {
    return employeesStore.list.filter((emp) => !isEmployeeIncomplete(emp));
  }
  return employeesStore.list;
});

const handleEdit = (employee: TheMemberViewModel) => {
  emit('edit', employee);
};

const handleDelete = async (employeeID: string) => {
  await executeWithFeedback(
    () => employeesStore.deleteEmployee(employeeID),
    t('pages.hrSettings.employees.messages.deleted'),
  );
};

const handleOptionClick = (option: EOptionsDropdown, employee: TheMemberViewModel) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(employee);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(employee.ID!);
  }
};

const skeletonData = createSkeletonData(5, {
  MemberName: '',
  RoleName: '',
  Tags: [] as string[],
  TitleName: '',
  TeamName: '',
  Salary: '',
  Enabled: false,
});
</script>

<style scoped></style>
