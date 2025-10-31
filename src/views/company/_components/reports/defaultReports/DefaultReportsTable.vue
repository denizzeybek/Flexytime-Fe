<template>
  <Card class="shadow-lg border mb-5 border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        :value="isLoading ? skeletonData : defaultReports"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column field="TypeDisplay" header="Report">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column field="ScheduleDisplay" header="Scheduling">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column field="To" header="To">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.To" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
          </template>
        </Column>
        <Column field="Cc" header="Cc">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.Cc" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
          </template>
        </Column>
        <Column field="Bcc" header="Bcc">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.Bcc" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
          </template>
        </Column>
        <Column field="SectionNameDisplay" header="Team">
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
            <Button icon="pi pi-plus" label="Add Report" @click="emit('new')" class="shadow-sm" />
            <FText>
              In total there are {{ defaultReports ? defaultReports.length : 0 }} reports.
            </FText>
          </div>
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Skeleton from 'primevue/skeleton';
import { useCompanyReportsStore } from '@/stores/company/reports';
import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import type { IReportItem } from '@/interfaces/company/report';
import Card from 'primevue/card';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: IReportItem): void;
}

const emit = defineEmits<IEmits>();

const reportsStore = useCompanyReportsStore();

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

const defaultReports = computed(() => reportsStore.Items);

const handleEdit = (annual: IReportItem) => {
  emit('edit', annual);
};

const handleDelete = (employeeID: string) => {
  console.log('employeeID ', employeeID);
  // annualsStore.deleteEmployee(employeeID);
};

const handleOptionClick = (option: EOptionsDropdown, annual: IReportItem) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(annual);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(annual.ID);
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  TypeDisplay: '',
  ScheduleDisplay: '',
  To: '',
  Cc: '',
  Bcc: '',
  SectionNameDisplay: '',
  Actions: '',
}));
</script>

<style scoped></style>
