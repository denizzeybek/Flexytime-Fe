<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="annuals"
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
            <FText> Loading annual data. Please wait. </FText>
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
        <Column sortable field="LeaveType" header="Leave Type"> </Column>
        <Column sortable field="Days" header="Days"> </Column>
        <Column sortable field="StartDate" header="StartDate">
          <template #body="slotProps">
            <div class="flex flex-col items-start gap-2">
              <FText>{{ slotProps.data.StartDate }}</FText>
              <FText>{{ slotProps.data.StartTime }}</FText>
            </div>
          </template>
        </Column>
        <Column sortable field="EndDate" header="End Date">
          <template #body="slotProps">
            <div class="flex flex-col items-start gap-2">
              <FText>{{ slotProps.data.EndDate }}</FText>
              <FText>{{ slotProps.data.EndTime }}</FText>
            </div>
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

        <template v-if="isActiveAnnuals" #footer>
          <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
            <Button icon="pi pi-plus" label="Add Annual" @click="emit('new')" />
            <FText> In total there are {{ annuals ? annuals.length : 0 }} annuals. </FText>
          </div>
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';
import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import type { IAnnual } from '@/interfaces/hrSettings/annual';
import { FilterMatchMode } from '@primevue/core/api';
import { useRoute } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: IAnnual): void;
  (event: 'delete', ID: string): void;
}

const emit = defineEmits<IEmits>();

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

const isActiveAnnuals = computed(() => route.name === ERouteNames.HRSettingsActiveAnnuals);

const annuals = computed(() => {
  if (isActiveAnnuals.value) {
    return annualsStore.activeList;
  } else {
    return annualsStore.passiveList;
  }
});

const handlePage = (e) => {
  console.log('e ', e);
};

const handleEdit = (annual: IAnnual) => {
  emit('edit', annual);
};

const handleDelete = (ID: string) => {
  emit('delete', ID)
};

const handleOptionClick = (option: EOptionsDropdown, annual: IAnnual) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(annual);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(annual.ID);
  }
};
</script>
