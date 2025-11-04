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
        <Column field="TypeDisplay" :header="$t('components.defaultReports.columns.report')">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column field="ScheduleDisplay" :header="$t('components.defaultReports.columns.scheduling')">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column field="To" :header="$t('components.defaultReports.columns.to')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.To" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
          </template>
        </Column>
        <Column field="Cc" :header="$t('components.defaultReports.columns.cc')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.Cc" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
          </template>
        </Column>
        <Column field="Bcc" :header="$t('components.defaultReports.columns.bcc')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.Bcc" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
          </template>
        </Column>
        <Column field="SectionNameDisplay" :header="$t('components.defaultReports.columns.team')">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column :header="$t('components.defaultReports.columns.actions')">
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
            <Button icon="pi pi-plus" :label="$t('components.defaultReports.addReport')" class="shadow-sm" @click="emit('new')" />
            <FText>
              {{ $t('components.defaultReports.totalReports', { count: defaultReports ? defaultReports.length : 0 }) }}
            </FText>
          </div>
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';

import type { IReportItem } from '@/interfaces/company/report';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: IReportItem): void;
}

defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

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
