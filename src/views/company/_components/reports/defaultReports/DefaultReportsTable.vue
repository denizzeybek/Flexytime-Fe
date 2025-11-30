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
        <Column field="TypeDisplay" :header="t('components.defaultReports.columns.report')">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column field="ScheduleDisplay" :header="t('components.defaultReports.columns.scheduling')">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column field="To" :header="t('components.defaultReports.columns.to')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-wrap gap-1">
              <Tag v-for="(email, idx) in parseEmails(slotProps.data.To)" :key="idx" :value="email" class="whitespace-nowrap" />
            </div>
          </template>
        </Column>
        <Column field="Cc" :header="t('components.defaultReports.columns.cc')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-wrap gap-1">
              <Tag v-for="(email, idx) in parseEmails(slotProps.data.Cc)" :key="idx" :value="email" class="whitespace-nowrap" />
            </div>
          </template>
        </Column>
        <Column field="Bcc" :header="t('components.defaultReports.columns.bcc')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <div v-else class="flex flex-wrap gap-1">
              <Tag v-for="(email, idx) in parseEmails(slotProps.data.Bcc)" :key="idx" :value="email" class="whitespace-nowrap" />
            </div>
          </template>
        </Column>
        <Column field="SectionNameDisplay" :header="t('components.defaultReports.columns.team')">
          <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        </Column>
        <Column :header="t('components.defaultReports.columns.actions')">
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
            <Button icon="pi pi-plus" :label="t('components.defaultReports.addReport')" class="shadow-sm" @click="emit('new')" />
            <FText>
              {{ t('components.defaultReports.totalReports', { count: defaultReports ? defaultReports.length : 0 }) }}
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

import type { ReportViewModel } from '@/client';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'new'): void;
  (event: 'edit', value: ReportViewModel): void;
  (event: 'delete', id: string): void;
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

const defaultReports = computed(() => reportsStore.defaultReportItems);

const parseEmails = (emailString: string | undefined): string[] => {
  if (!emailString) return [];
  return emailString.split(',').map((e) => e.trim()).filter(Boolean);
};

const handleEdit = (report: ReportViewModel) => {
  emit('edit', report);
};

const handleDelete = (id: string) => {
  emit('delete', id);
};

const handleOptionClick = (option: EOptionsDropdown, report: ReportViewModel) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(report);
  } else if (option === EOptionsDropdown.Delete) {
    if (report.ID) {
      handleDelete(report.ID);
    }
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
