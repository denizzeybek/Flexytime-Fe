<template>
  <Card class="shadow-md border border-border-secondary dark:border-border-primary rounded-xl transition-colors">
    <template #header>
      <div class="flex items-center justify-between flex-wrap px-5 pt-5 gap-4">
        <div class="flex gap-6 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="text-content-tertiary">{{ t('pages.company.reports.elasticReports.summary.total') }}</span>
            <span class="font-semibold text-lg">{{ summary?.Total ?? '00:00' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-content-tertiary">{{ t('pages.company.reports.elasticReports.summary.billable') }}</span>
            <span class="font-semibold text-lg text-green-600">{{ summary?.Billable ?? '00:00' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-content-tertiary">{{ t('pages.company.reports.elasticReports.summary.unbillable') }}</span>
            <span class="font-semibold text-lg text-orange-600">{{ summary?.Unbillable ?? '00:00' }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <Button
            icon="pi pi-bookmark"
            :label="t('pages.company.reports.timeEntries.saveAsFilter')"
            severity="secondary"
            outlined
            :disabled="isLoading"
            @click="emit('saveFilter')"
          />
          <Button
            icon="pi pi-download"
            :label="t('pages.company.reports.elasticReports.download')"
            severity="secondary"
            outlined
            :disabled="isLoading"
            @click="emit('download')"
          />
        </div>
        <Dialog
          v-model:visible="dialogOpen"
          modal
          :header="t('pages.company.reports.timeEntries.saveDialog.title')"
          :style="{ width: '420px' }"
          :closable="!saving"
        >
          <div class="flex flex-col gap-3">
            <label class="text-sm font-medium" for="saved-filter-name">
              {{ t('pages.company.reports.timeEntries.saveDialog.nameLabel') }}
            </label>
            <InputText
              id="saved-filter-name"
              v-model="filterName"
              :placeholder="t('pages.company.reports.timeEntries.saveDialog.namePlaceholder')"
              :disabled="saving"
              @keydown.enter="emit('confirmSave')"
            />
            <div class="flex justify-end gap-2 mt-2">
              <Button
                :label="t('pages.company.reports.dialog.cancel')"
                severity="secondary"
                outlined
                :disabled="saving"
                @click="dialogOpen = false"
              />
              <Button
                :label="t('pages.company.reports.timeEntries.saveDialog.save')"
                severity="primary"
                :loading="saving"
                :disabled="!filterName.trim()"
                @click="emit('confirmSave')"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </template>
    <template #content>
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <ProgressSpinner />
      </div>
      <div v-else-if="hasChartData" class="h-80">
        <Chart :type="EChartType.BAR" :data="chartData" :options="chartOptions" class="h-full" />
      </div>
      <NoDataState v-else :message="t('pages.company.reports.elasticReports.noData')" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';

import NoDataState from '@/components/common/NoDataState.vue';
import { EChartType } from '@/enums/chartType.enum';
import { type MessageSchema } from '@/plugins/i18n';

import type { ReportSummaryViewModel } from '@/client';

interface IProps {
  summary: ReportSummaryViewModel | null;
  isLoading: boolean;
  hasChartData: boolean;
  chartData: Record<string, unknown>;
  chartOptions: Record<string, unknown>;
  saving: boolean;
}

interface IEmits {
  (event: 'saveFilter'): void;
  (event: 'download'): void;
  (event: 'confirmSave'): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();

const dialogOpen = defineModel<boolean>('dialogOpen', { required: true });
const filterName = defineModel<string>('filterName', { required: true });

const { t } = useI18n<{ message: MessageSchema }>();
</script>
