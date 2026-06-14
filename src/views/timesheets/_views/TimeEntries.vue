<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="hidden lg:block lg:col-span-2" />
      <div class="lg:col-span-1 flex flex-col sm:flex-row gap-3 items-stretch">
        <FSelect
          name="suggestionsHours"
          :options="hoursOptions"
          :placeholder="t('pages.timesheets.timeEntries.hoursFilter.placeholder')"
          class="w-full sm:w-28 flex-shrink-0"
          @selected="onHoursChange"
        />
        <DateRangePicker
          v-model="selectedRange"
          :maxDate="maxDate"
          :placeholder="t('pages.timesheets.timeEntries.datePicker.placeholder')"
          class="w-full flex-1 h-11"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 flex flex-col gap-4">
        <EnterTime />
        <EnteredTimes />
      </div>

      <div class="lg:col-span-1">
        <SuggestionsPanel :range="selectedRange" :hours="selectedHours" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useForm } from 'vee-validate';

import DateRangePicker, { type DateRange } from '@/components/common/DateRangePicker.vue';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import SuggestionsPanel from '@/views/timesheets/_components/timeEntries/_components/suggestions/SuggestionsPanel.vue';
import EnteredTimes from '@/views/timesheets/_components/timeEntries/EnteredTimes.vue';
import EnterTime from '@/views/timesheets/_components/timeEntries/EnterTime.vue';

import type { MessageSchema } from '@/plugins/i18n';

dayjs.extend(isoWeek);

const { t } = useI18n<{ message: MessageSchema }>();
const route = useRoute();
const router = useRouter();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const ALLOWED_HOURS = [1, 4, 8, 24] as const;

const parseDateFromQuery = (raw: unknown, fallback: Date): Date => {
  if (typeof raw !== 'string' || raw.length === 0) return fallback;
  const d = dayjs(raw);
  return d.isValid() ? d.toDate() : fallback;
};

const parseHoursFromQuery = (raw: unknown): number => {
  const n = typeof raw === 'string' ? Number(raw) : NaN;
  return ALLOWED_HOURS.includes(n as (typeof ALLOWED_HOURS)[number]) ? n : 4;
};

const initialStart = parseDateFromQuery(route.query.start, dayjs().subtract(6, 'day').startOf('day').toDate());
const initialEnd = parseDateFromQuery(route.query.end, dayjs().endOf('day').toDate());
const initialHours = parseHoursFromQuery(route.query.hours);

const selectedRange = ref<DateRange>({ start: initialStart, end: initialEnd });

const maxDate = computed(() => new Date());

const hoursOptions = computed(() => [
  { name: t('pages.timesheets.timeEntries.hoursFilter.hourly'), value: '1', label: t('pages.timesheets.timeEntries.hoursFilter.hourly') },
  { name: t('pages.timesheets.timeEntries.hoursFilter.fourHours'), value: '4', label: t('pages.timesheets.timeEntries.hoursFilter.fourHours') },
  { name: t('pages.timesheets.timeEntries.hoursFilter.eightHours'), value: '8', label: t('pages.timesheets.timeEntries.hoursFilter.eightHours') },
  { name: t('pages.timesheets.timeEntries.hoursFilter.allDay'), value: '24', label: t('pages.timesheets.timeEntries.hoursFilter.allDay') },
]);

useForm({
  initialValues: {
    suggestionsHours: hoursOptions.value.find((o) => o.value === String(initialHours)),
  },
});

const selectedHours = ref<number>(initialHours);

const onHoursChange = (option: { name: string; value: string }) => {
  selectedHours.value = Number(option.value);
};

const fmtQueryDate = (d?: Date | null): string | undefined =>
  d ? dayjs(d).format('YYYY-MM-DD') : undefined;

const syncQuery = (): void => {
  const next: Record<string, string> = { ...route.query } as Record<string, string>;
  const start = fmtQueryDate(selectedRange.value.start);
  const end = fmtQueryDate(selectedRange.value.end);
  if (start) next.start = start; else delete next.start;
  if (end) next.end = end; else delete next.end;
  next.hours = String(selectedHours.value);
  void router.replace({ query: next });
};

const fetchEntries = async () => {
  const { start, end } = selectedRange.value;
  if (!start || !end) return;
  await timeEntriesStore.fetchTimeEntriesRange(start, end);
};

watch(selectedRange, () => {
  syncQuery();
  void fetchEntries();
}, { deep: true, immediate: true });

watch(selectedHours, syncQuery);
</script>
