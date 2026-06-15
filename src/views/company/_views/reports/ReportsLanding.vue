<template>
  <div class="flex flex-col gap-6">
    <Card class="shadow-md border border-border-secondary dark:border-border-primary rounded-xl transition-colors">
      <template #header>
        <div class="px-5 pt-5">
          <h2 class="text-xl font-semibold">{{ t('pages.company.reports.landing.title') }}</h2>
          <p class="text-content-tertiary text-sm mt-1">
            {{ t('pages.company.reports.landing.subtitle') }}
          </p>
        </div>
      </template>
      <template #content>
        <div v-if="loadingPresets" class="flex justify-center py-12">
          <ProgressSpinner />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="preset in presets"
            :key="preset.id"
            class="border border-border-secondary dark:border-border-primary rounded-lg hover:shadow-lg transition-shadow"
          >
            <template #content>
              <div class="flex flex-col gap-3 h-full">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-base">{{ preset.name }}</h3>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="
                      preset.dataSource === 'worktime'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    "
                  >
                    {{ preset.dataSource === 'worktime' ? 'Worktime' : 'Time Entries' }}
                  </span>
                </div>
                <p class="text-content-tertiary text-sm flex-1">
                  {{ describePreset(preset.id) }}
                </p>
                <div class="flex gap-2 mt-auto">
                  <Button
                    icon="pi pi-play"
                    :label="t('pages.company.reports.landing.run')"
                    severity="primary"
                    size="small"
                    :loading="runningPresetId === preset.id"
                    @click="onRunPreset(preset)"
                  />
                  <Button
                    icon="pi pi-download"
                    :label="t('pages.company.reports.landing.download')"
                    severity="secondary"
                    outlined
                    size="small"
                    @click="onDownloadPreset(preset)"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </template>
    </Card>

    <Card
      v-if="lastResult"
      class="shadow-md border border-border-secondary dark:border-border-primary rounded-xl transition-colors"
    >
      <template #header>
        <div class="flex items-center justify-between px-5 pt-5">
          <h3 class="font-semibold">{{ lastResultPresetName }} — {{ lastResult.Summary.Total }}</h3>
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            @click="lastResult = null"
          />
        </div>
      </template>
      <template #content>
        <div v-if="lastResult.Grouping.length === 0" class="text-content-tertiary text-center py-8">
          {{ t('pages.company.reports.landing.empty') }}
        </div>
        <DataTable v-else :value="lastResult.Grouping" :paginator="lastResult.Grouping.length > 10" :rows="10">
          <Column field="Group1" header="Group 1" />
          <Column field="Group2" header="Group 2" />
          <Column field="Total" header="Total" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';

import { DownloadService } from '@/customClient/services/DownloadService';
import {
  ReportsApiService,
  type ReportPresetMeta,
  type ReportRunResult,
} from '@/customClient/services/ReportsApiService';
import type { MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
const toast = useToast();

const presets = ref<ReportPresetMeta[]>([]);
const loadingPresets = ref(false);
const runningPresetId = ref<string | null>(null);
const lastResult = ref<ReportRunResult | null>(null);
const lastResultPreset = ref<ReportPresetMeta | null>(null);

const lastResultPresetName = computed(() => lastResultPreset.value?.name ?? '');

const PRESET_BLURBS: Record<string, string> = {
  'timesheet-summary': 'Manual time entries by employee, project, and day.',
  'project-hours': 'Project totals split by employee — last month.',
  'activity-by-domain': 'Worktime split across Work / Meeting / Leisure / Unclassified.',
  'application-usage': 'Top applications by time spent (worktime agent data).',
  'attendance': 'Daily shift duration per employee (worktime agent data).',
};

const describePreset = (id: string): string => PRESET_BLURBS[id] ?? '';

const onRunPreset = async (preset: ReportPresetMeta) => {
  runningPresetId.value = preset.id;
  try {
    const result = await ReportsApiService.run({ presetId: preset.id });
    lastResult.value = result;
    lastResultPreset.value = preset;
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Report run failed',
      detail: err instanceof Error ? err.message : String(err),
      life: 4000,
    });
  } finally {
    runningPresetId.value = null;
  }
};

const onDownloadPreset = async (preset: ReportPresetMeta) => {
  try {
    await DownloadService.downloadReportXlsx({ Interval: '7' });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Download failed',
      detail: err instanceof Error ? err.message : String(err),
      life: 4000,
    });
  }
};

onMounted(async () => {
  loadingPresets.value = true;
  try {
    presets.value = await ReportsApiService.listPresets();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Failed to load presets',
      detail: err instanceof Error ? err.message : String(err),
      life: 4000,
    });
  } finally {
    loadingPresets.value = false;
  }
});
</script>
