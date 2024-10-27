<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="employees"
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
            <FText>No customers found.</FText>
          </div>
        </template>
        <template #loading>
          <div class="w-full flex justify-center py-8">
            <FText> Loading customers data. Please wait. </FText>
          </div>
        </template>
        <Column sortable field="MemberName" header="Name">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FAvatar :label="slotProps.data.MemberName" />
              <FText>{{ slotProps.data.MemberName }}</FText>
            </div>
          </template>
        </Column>
        <Column sortable field="RoleName" header="Role Name"> </Column>
        <Column field="Tags" header="Tags">
          <template #body="slotProps">
            <div v-if="slotProps.data.Tags?.length" class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.Tags" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
            <div v-else></div>
          </template>
        </Column>
        <Column sortable field="TitleName" header="Title Name"> </Column>
        <Column sortable field="TeamName" header="Team Name"> </Column>
        <Column field="Salary" header="Salary"> </Column>
        <Column header="Enabled">
          <template #body="slotProps">
            <Checkbox
              @change="
                handleAlwaysOnChange({
                  props: slotProps.data.ID,
                  alwaysOn: !slotProps.data.Enabled,
                })
              "
              :modelValue="slotProps.data.Enabled"
              :binary="true"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <OptionsDropdown
              :options="options"
              @optionClick="handleOptionClick($event, slotProps.data)"
            />
          </template>
        </Column>

        <template #footer>
          <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
            <Button icon="pi pi-plus" label="Add User" @click="emit('new')"></Button>
            <FText> In total there are {{ employees ? employees.length : 0 }} employees. </FText>
          </div>
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Tag from 'primevue/tag';
import Checkbox from 'primevue/checkbox';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/employees';
import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import type { IEmployeeMember } from '@/interfaces/hrSettings/employee';
import { FilterMatchMode } from '@primevue/core/api';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: IEmployeeMember): void;
}

const emit = defineEmits<IEmits>();

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

const handlePage = (e) => {
  console.log('e ', e);
};

const handleAlwaysOnChange = async (event) => {
  try {
    const { props, alwaysOn } = event;
    const { ID, Name, Domain } = props;
    const payload = {
      ID,
      Name,
      Domain,
      AlwaysOn: alwaysOn,
    };

    // await employeesStore.update()
  } catch (error) {
    console.log(error);
  }
};

const handleEdit = (employee: IEmployeeMember) => {
  emit('edit', employee);
};

const handleDelete = (employeeID: string) => {
  // employeesStore.deleteEmployee(employeeID);
};

const handleOptionClick = (option: EOptionsDropdown, employee: IEmployeeMember) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(employee);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(employee.ID);
  }
};
</script>

<style scoped></style>
