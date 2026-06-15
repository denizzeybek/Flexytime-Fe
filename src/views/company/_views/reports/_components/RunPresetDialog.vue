<template>
  <Dialog
    :visible="visible"
    modal
    :header="preset?.name ?? t('pages.company.reports.dialog.title')"
    :style="{ width: '460px' }"
    :closable="!busy"
    @update:visible="onVisibleChange"
  >
    <div v-if="preset" class="flex flex-col gap-4">
      <p class="text-content-tertiary text-sm">
        {{ blurb }}
      </p>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">{{ t('pages.company.reports.dialog.dateRange') }}</label>
        <DatePicker
          v-model="selectedRange"
          selectionMode="range"
          dateFormat="dd/mm/yy"
          showIcon
          :disabled="busy"
        />
        <div class="flex flex-wrap gap-1.5 mt-1">
          <Button
            v-for="quick in quickRanges"
            :key="quick.label"
            :label="quick.label"
            severity="secondary"
            size="small"
            text
            :disabled="busy"
            @click="applyQuickRange(quick)"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <Button
          :label="t('pages.company.reports.dialog.cancel')"
          severity="secondary"
          outlined
          :disabled="busy"
          @click="close"
        />
        <Button
          icon="pi pi-download"
          :label="t('pages.company.reports.dialog.download')"
          severity="primary"
          :loading="busy"
          :disabled="!isRangeValid"
          @click="onDownload"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';

import {
  type ReportPresetMeta,
  ReportsApiService,
} from '@/customClient/services/ReportsApiService';

import type { MessageSchema } from '@/plugins/i18n';

const props = withDefaults(defineProps<Props>(), { blurb: '' });
const emit = defineEmits<{ (e: 'update:visible', value: boolean): void }>();
const { t } = useI18n<{ message: MessageSchema }>();
const toast = useToast();

interface Props {
  visible: boolean;
  preset: ReportPresetMeta | null;
  blurb?: string;
}

const busy = ref(false);
const today = new Date();
const defaultRange = (days: number): Date[] => {
  const start = new Date();
  start.setDate(today.getDate() - (days - 1));
  return [start, today];
};

const selectedRange = ref<Date[]>(defaultRange(7));

const isRangeValid = computed(
  () =>
    Array.isArray(selectedRange.value) &&
    selectedRange.value.length === 2 &&
    selectedRange.value[0] instanceof Date &&
    selectedRange.value[1] instanceof Date,
);

interface QuickRange {
  label: string;
  apply: () => Date[];
}

const quickRanges: QuickRange[] = [
  { label: 'Last 7 days', apply: () => defaultRange(7) },
  { label: 'Last 30 days', apply: () => defaultRange(30) },
  {
    label: 'This month',
    apply: () => {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return [start, today];
    },
  },
  {
    label: 'Last month',
    apply: () => {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return [start, end];
    },
  },
];

const applyQuickRange = (q: QuickRange) => {
  selectedRange.value = q.apply();
};

watch(
  () => props.visible,
  (v) => {
    if (v) {
      const defaultDays = props.preset?.dataSource === 'worktime' ? 30 : 7;
      selectedRange.value = defaultRange(defaultDays);
    }
  },
);

const close = () => emit('update:visible', false);
const onVisibleChange = (value: boolean) => emit('update:visible', value);

const formatDateForInterval = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const buildIntervalString = (range: Date[]): string => {
  const [start, end] = range;
  if (!(start instanceof Date) || !(end instanceof Date)) return '';
  const ms = end.getTime() - start.getTime();
  const dayCount = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  return `${formatDateForInterval(start)}-${dayCount}`;
};

const onDownload = async () => {
  if (!props.preset || !isRangeValid.value) return;
  busy.value = true;
  try {
    const interval = buildIntervalString(selectedRange.value);
    await ReportsApiService.downloadPreset(props.preset.id, { Interval: interval });
    close();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Download failed',
      detail: err instanceof Error ? err.message : String(err),
      life: 4000,
    });
  } finally {
    busy.value = false;
  }
};
</script>
