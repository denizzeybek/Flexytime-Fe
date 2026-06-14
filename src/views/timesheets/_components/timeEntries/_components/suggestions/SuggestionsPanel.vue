<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors h-full">
    <template #content>
      <div class="flex flex-col h-full">
        <div class="flex items-center gap-2 pb-3 border-b border-border-secondary dark:border-border-primary">
          <i class="pi pi-sparkles text-f-primary text-lg" />
          <FText as="h5" class="!font-semibold">{{ t('pages.timesheets.timeEntries.suggestions.title') }}</FText>
        </div>

        <div class="flex-1 overflow-y-auto py-3 pr-1 -mr-1">
          <SuggestionLoadingState v-if="timeEntriesStore.loading" />
          <SuggestionEmptyState v-else-if="!fields.length" />
          <template v-else>
            <div class="flex flex-col gap-3">
              <div v-for="day in suggestionDays" :key="day.dayKey" class="flex flex-col gap-3">
                <div class="flex items-center gap-2 sticky top-0 z-10 w-full px-4 py-2 bg-surface-primary rounded-full shadow-sm border border-border-secondary dark:border-border-primary">
                  <button
                    type="button"
                    class="w-5 h-5 min-w-5 min-h-5 rounded-sm border flex items-center justify-center transition-colors flex-shrink-0"
                    :class="checkboxClass(daySelectionState(day))"
                    @click.stop="toggleDaySelection(day)"
                  >
                    <i v-if="daySelectionState(day).indeterminate" class="pi pi-minus text-white text-[10px]" />
                    <i v-else-if="daySelectionState(day).checked" class="pi pi-check text-white text-[10px]" />
                  </button>
                  <button
                    type="button"
                    class="flex-1 flex items-center justify-between gap-3 text-left"
                    @click="toggleDay(day.dayKey)"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <i class="pi pi-calendar text-f-primary text-xs" />
                      <span class="text-xs font-semibold text-content-secondary">{{ day.dayLabel }}</span>
                      <span class="text-content-tertiary/50">•</span>
                      <span class="text-xs text-content-tertiary">
                        {{ formatSpendTime(day.totalSeconds) }}
                      </span>
                    </div>
                    <i
                      class="pi text-content-tertiary text-[10px] transition-transform duration-200 flex-shrink-0"
                      :class="isDayExpanded(day.dayKey) ? 'pi-chevron-down' : 'pi-chevron-right'"
                    />
                  </button>
                </div>

                <div v-show="isDayExpanded(day.dayKey)" class="flex flex-col gap-4">
                  <div v-for="bucket in day.buckets" :key="bucket.fieldKey">
                    <div class="flex items-center gap-2 w-full mb-2 pl-4">
                      <button
                        type="button"
                        class="w-5 h-5 min-w-5 min-h-5 rounded-sm border flex items-center justify-center transition-colors flex-shrink-0"
                        :class="checkboxClass(bucketSelectionState(bucket))"
                        @click.stop="toggleBucketSelection(bucket)"
                      >
                        <i v-if="bucketSelectionState(bucket).indeterminate" class="pi pi-minus text-white text-[10px]" />
                        <i v-else-if="bucketSelectionState(bucket).checked" class="pi pi-check text-white text-[10px]" />
                      </button>
                      <button
                        type="button"
                        class="flex-1 flex items-center justify-between gap-2 text-left"
                        @click="toggleBucket(bucket.fieldKey)"
                      >
                        <div class="flex items-center gap-2">
                          <div class="w-8 h-8 rounded-lg bg-f-primary/10 flex items-center justify-center">
                            <i class="pi pi-clock text-f-primary text-sm" />
                          </div>
                          <div class="text-sm font-bold text-content-primary leading-tight">
                            {{ isAllDay ? day.dayLabel : formatBucketRange(bucket.recordDate) }}
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <Tag
                            :value="bucketSlotLabel"
                            severity="secondary"
                            class="!text-[10px] !px-2 !py-0.5"
                          />
                          <i
                            class="pi text-content-tertiary text-[10px] transition-transform duration-200"
                            :class="isBucketExpanded(bucket.fieldKey) ? 'pi-chevron-down' : 'pi-chevron-right'"
                          />
                        </div>
                      </button>
                    </div>

                    <div v-show="isBucketExpanded(bucket.fieldKey)" class="flex flex-col gap-2 pl-2 border-l-2 border-border-secondary dark:border-border-primary">
                      <SuggestionClockCard
                        v-for="(clock, tIdx) in bucket.clocks"
                        :key="tIdx"
                        :clock="clock"
                        :group-index="bucket.groupIndex"
                        :clock-index="tIdx"
                        :indeterminate="isClockIndeterminate(bucket.groupIndex, tIdx)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

      </div>
    </template>
  </Card>

  <SuggestionConvertModal
    v-model:open="convertOpen"
    :selected-items="selectedItems"
    :total-time="totalSelectedTime"
    :project-options="projectOptions"
    :tag-options="tagOptions"
    :task-options="taskOptions"
    @convert="onConvert"
    @clear="onClearSelection"
    @cancel="onModalCancel"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { useFieldArray, useForm } from 'vee-validate';

import { TimesheetService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import { useProfileStore } from '@/stores/profile/profile';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { useSuggestionDomainHelpers } from '@/views/timesheets/_composables/useSuggestionDomainHelpers';

import SuggestionClockCard from './SuggestionClockCard.vue';
import SuggestionConvertModal from './SuggestionConvertModal.vue';
import SuggestionEmptyState from './SuggestionEmptyState.vue';
import SuggestionLoadingState from './SuggestionLoadingState.vue';

import type { DateRange } from '@/components/common/DateRangePicker.vue';
import type { MessageSchema } from '@/plugins/i18n';

const props = defineProps<IProps>();
dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  range: DateRange;
  hours: number;
}

const { t } = useI18n<{ message: MessageSchema }>();
const timeEntriesStore = useTimesheetsTimeEntriesStore();
const profileStore = useProfileStore();
const { formatSpendTime } = useSuggestionDomainHelpers();
const { showSuccessMessage, showErrorMessage } = useFToast();

interface SuggestionClockDetailForm {
  ID?: string;
  Name?: string;
  Title?: string;
  Spend?: number;
  Selected?: boolean;
}

interface SuggestionClockForm {
  ID?: string;
  Name?: string;
  Title?: string;
  Spend?: number;
  Domain?: number;
  Selected?: boolean;
  Details?: SuggestionClockDetailForm[];
}

interface SuggestionGroupForm {
  RecordDate?: string;
  Clocks?: SuggestionClockForm[];
}

interface SuggestionForm {
  suggestions: SuggestionGroupForm[];
}

const selectedHours = computed(() => props.hours);

const isAllDay = computed(() => selectedHours.value === 24);

const bucketSlotLabel = computed(() => {
  const h = selectedHours.value;
  return h === 24 ? t('pages.timesheets.timeEntries.suggestions.allDaySlot') : `${h}h slot`;
});

const { resetForm, setFieldValue } = useForm<SuggestionForm>({
  initialValues: {
    suggestions: [],
  },
});

const setSelected = (path: string, value: boolean) => {
  (setFieldValue as (p: string, v: boolean) => void)(path, value);
};

const { fields, update: updateField } = useFieldArray<SuggestionGroupForm>('suggestions');

const projectOptions = computed(() => timeEntriesStore.projectOptions);
const tagOptions = computed(() => timeEntriesStore.tagOptions);
const taskOptions = computed(() => timeEntriesStore.taskOptions);

const previousClockSelected = ref<Map<string, boolean>>(new Map());
const previousDetailSelected = ref<Map<string, boolean>>(new Map());
const suppressClockToDetailsCascade = ref<Set<string>>(new Set());

const selectedItems = ref<SuggestionClockForm[]>([]);

const collapsedBuckets = ref<Set<string>>(new Set());
const collapsedDays = ref<Set<string>>(new Set());

const isBucketExpanded = (key: string): boolean => !collapsedBuckets.value.has(key);

const toggleBucket = (key: string): void => {
  const next = new Set(collapsedBuckets.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  collapsedBuckets.value = next;
};

const isDayExpanded = (key: string): boolean => !collapsedDays.value.has(key);

const toggleDay = (key: string): void => {
  const next = new Set(collapsedDays.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  collapsedDays.value = next;
};

interface DayBucket {
  fieldKey: string;
  recordDate: string;
  groupIndex: number;
  clocks: SuggestionClockForm[];
  totalSeconds: number;
}

interface DayGroup {
  dayKey: string;
  dayLabel: string;
  totalSeconds: number;
  buckets: DayBucket[];
}

const dayLabelFor = (iso: string): string => {
  const tz = profileStore.TimeZone || dayjs.tz.guess();
  const d = dayjs.utc(iso).tz(tz);
  if (!d.isValid()) return '';
  const today = dayjs().tz(tz);
  const yesterday = today.subtract(1, 'day');
  if (d.isSame(today, 'day')) return t('common.dates.today');
  if (d.isSame(yesterday, 'day')) return t('common.dates.yesterday');
  return d.format('DD MMMM YYYY');
};

const dayKeyFor = (iso: string): string => {
  const tz = profileStore.TimeZone || dayjs.tz.guess();
  return dayjs.utc(iso).tz(tz).format('YYYY-MM-DD');
};

const sumBucketSeconds = (clocks: SuggestionClockForm[]): number =>
  clocks.reduce((acc, c) => acc + (c.Spend ?? 0), 0);

const countLeaves = (clocks: SuggestionClockForm[]): { total: number; selected: number } => {
  let total = 0;
  let selected = 0;
  for (const clock of clocks) {
    if (clock.Details?.length) {
      for (const d of clock.Details) {
        total++;
        if (d.Selected) selected++;
      }
    } else {
      total++;
      if (clock.Selected) selected++;
    }
  }
  return { total, selected };
};

const bucketSelectionState = (bucket: DayBucket): { checked: boolean; indeterminate: boolean } => {
  const { total, selected } = countLeaves(bucket.clocks);
  if (total === 0 || selected === 0) return { checked: false, indeterminate: false };
  if (selected === total) return { checked: true, indeterminate: false };
  return { checked: false, indeterminate: true };
};

const daySelectionState = (day: DayGroup): { checked: boolean; indeterminate: boolean } => {
  let total = 0;
  let selected = 0;
  for (const bucket of day.buckets) {
    const leaves = countLeaves(bucket.clocks);
    total += leaves.total;
    selected += leaves.selected;
  }
  if (total === 0 || selected === 0) return { checked: false, indeterminate: false };
  if (selected === total) return { checked: true, indeterminate: false };
  return { checked: false, indeterminate: true };
};

const checkboxClass = (state: { checked: boolean; indeterminate: boolean }): string => {
  if (state.checked || state.indeterminate) {
    return 'border-f-primary bg-f-primary hover:bg-f-primary-hovered hover:border-f-primary-hovered cursor-pointer';
  }
  return 'border-f-stroke hover:border-f-primary bg-f-white hover:bg-f-primary/5 cursor-pointer';
};

const applyBucketSelection = (groupIndex: number, willCheck: boolean): void => {
  const groupField = fields.value[groupIndex];
  if (!groupField?.value) return;
  const currentClocks = groupField.value.Clocks ?? [];
  const newClocks: SuggestionClockForm[] = currentClocks.map((clock) => ({
    ...clock,
    Selected: willCheck,
    ...(clock.Details?.length && {
      Details: clock.Details.map((d) => ({ ...d, Selected: willCheck })),
    }),
  }));
  updateField(groupIndex, { ...groupField.value, Clocks: newClocks });
};

const toggleBucketSelection = (bucket: DayBucket): void => {
  const willCheck = !bucketSelectionState(bucket).checked;
  applyBucketSelection(bucket.groupIndex, willCheck);
};

const toggleDaySelection = (day: DayGroup): void => {
  const willCheck = !daySelectionState(day).checked;
  for (const bucket of day.buckets) {
    applyBucketSelection(bucket.groupIndex, willCheck);
  }
};

const suggestionDays = computed<DayGroup[]>(() => {
  const map = new Map<string, DayGroup>();
  fields.value.forEach((field, idx) => {
    const recordDate = field.value?.RecordDate;
    if (!recordDate) return;
    const dayKey = dayKeyFor(recordDate);
    let day = map.get(dayKey);
    if (!day) {
      day = {
        dayKey,
        dayLabel: dayLabelFor(recordDate),
        totalSeconds: 0,
        buckets: [],
      };
      map.set(dayKey, day);
    }
    const clocks = field.value?.Clocks ?? [];
    const bucketSeconds = sumBucketSeconds(clocks);
    day.buckets.push({
      fieldKey: String(field.key),
      recordDate,
      groupIndex: idx,
      clocks,
      totalSeconds: bucketSeconds,
    });
    day.totalSeconds += bucketSeconds;
  });
  return Array.from(map.values());
});

const totalSelectedTime = computed(() => {
  const totalSeconds = selectedItems.value.reduce((acc, item) => acc + (item.Spend || 0), 0);
  return formatSpendTime(totalSeconds);
});

const formatBucketRange = (iso?: string): string => {
  if (!iso) return '';
  const tz = profileStore.TimeZone || dayjs.tz.guess();
  const start = dayjs.utc(iso).tz(tz);
  if (!start.isValid()) return '';
  const end = start.add(selectedHours.value, 'hour');
  return `${start.format('HH:mm')} → ${end.format('HH:mm')}`;
};

const isClockIndeterminate = (groupIdx: number, clockIdx: number): boolean => {
  const clock = fields.value[groupIdx]?.value?.Clocks?.[clockIdx];
  if (!clock?.Details?.length) return false;
  const selectedCount = clock.Details.filter((d) => d.Selected).length;
  return selectedCount > 0 && selectedCount < clock.Details.length;
};

const setInitialFormData = (data: typeof timeEntriesStore.timeClocks): SuggestionGroupForm[] => {
  return (data ?? []).map((group) => ({
    RecordDate: group.RecordDate,
    Clocks: group.Clocks?.map((clock) => ({
      ID: clock.ID,
      Selected: clock.Selected ?? false,
      Name: clock.Name,
      Title: clock.Title,
      Domain: clock.Domain,
      Spend: clock.Spend,
      Details: clock.Details?.map((detail) => ({
        ID: detail.ID,
        Selected: detail.Selected ?? false,
        Name: detail.Name,
        Title: detail.Title,
        Spend: detail.Spend,
      })),
    })),
  }));
};

const getSelectedTrueObjects = (data: SuggestionGroupForm[]): SuggestionClockForm[] => {
  const selected: SuggestionClockForm[] = [];

  data?.forEach((group) => {
    group.Clocks?.forEach((clock) => {
      if (!clock.Details?.length) {
        if (clock.Selected) {
          selected.push(clock);
        }
      } else {
        clock.Details?.forEach((detail) => {
          if (detail.Selected) {
            selected.push(detail as SuggestionClockForm);
          }
        });

        const isEveryChildSelected = clock.Details.every((detail) => detail.Selected);
        if (!isEveryChildSelected) {
          clock.Selected = false;
        }
        if (clock.Selected) {
          clock.Details.forEach((detail) => (detail.Selected = true));
        }
      }
    });
  });

  return selected;
};

const fetchClocks = async () => {
  const start = props.range.start;
  const end = props.range.end;
  if (!start || !end) return;
  await timeEntriesStore.fetchTimeClocksRange(start, end, selectedHours.value);
};

const onClearSelection = () => {
  resetForm({
    values: {
      suggestions: setInitialFormData(timeEntriesStore.timeClocks),
    },
  });
};

const convertOpen = ref(false);

const onModalCancel = () => {
  if (selectedItems.value.length > 0) {
    onClearSelection();
  }
};

const computeEntryRanges = (): Array<{ start: Date; end: Date }> => {
  const ranges: Array<{ start: Date; end: Date }> = [];
  for (const group of fields.value) {
    let spendSum = 0;
    for (const clock of group.value?.Clocks ?? []) {
      if (clock.Details?.length) {
        for (const detail of clock.Details) {
          if (detail.Selected) spendSum += detail.Spend ?? 0;
        }
      } else if (clock.Selected) {
        spendSum += clock.Spend ?? 0;
      }
    }
    if (spendSum > 0 && group.value?.RecordDate) {
      const start = new Date(group.value.RecordDate);
      if (!Number.isNaN(start.getTime())) {
        const end = new Date(start.getTime() + spendSum * 1000);
        ranges.push({ start, end });
      }
    }
  }
  return ranges;
};

const onConvert = async (payload: {
  taskId?: string;
  projectId?: string;
  tagIds: string[];
  billable: boolean;
}) => {
  if (!payload.taskId) {
    showErrorMessage(new Error(t('pages.timesheets.timeEntries.suggestions.modal.taskRequired')));
    return;
  }
  if (!payload.projectId) {
    showErrorMessage(new Error(t('pages.timesheets.timeEntries.suggestions.modal.projectRequired')));
    return;
  }
  const ranges = computeEntryRanges();
  if (ranges.length === 0) {
    showErrorMessage(new Error(t('pages.timesheets.timeEntries.suggestions.modal.noSelection')));
    return;
  }
  try {
    for (const range of ranges) {
      const result = await TimesheetService.timesheetControllerSaveTimeEntry({
        StartDate: range.start.toISOString(),
        EndDate: range.end.toISOString(),
        TaskId: payload.taskId,
        ProjectId: payload.projectId,
        TagIds: payload.tagIds,
        Billable: payload.billable,
      });
      if (result?.Status !== 0) {
        const first = result?.Errors?.[0]?.Message ?? t('pages.timesheets.timeEntries.suggestions.modal.saveFailed');
        showErrorMessage(new Error(first));
        return;
      }
    }
    showSuccessMessage(t('pages.timesheets.timeEntries.suggestions.convertSuccess'));
    onClearSelection();
    await Promise.all([
      timeEntriesStore.refreshLastEntries(),
      fetchClocks(),
    ]);
  } catch (error: unknown) {
    showErrorMessage(error as Error);
  }
};

watch(
  () => selectedItems.value.length,
  (count) => {
    convertOpen.value = count > 0;
  },
);

watch(
  () => fields.value,
  (newValue) => {
    const newData = newValue.map((element) => element.value);

    newData.forEach((group, groupIdx) => {
      group.Clocks?.forEach((clock, clockIdx) => {
        if (!clock.Details?.length) return;

        const clockKey = `${groupIdx}-${clockIdx}`;
        const prevClockSelected = previousClockSelected.value.get(clockKey);
        const currentClockSelected = clock.Selected;

        const clockChanged = prevClockSelected !== undefined && prevClockSelected !== currentClockSelected;
        const isSuppressed = suppressClockToDetailsCascade.value.has(clockKey);

        if (isSuppressed) {
          suppressClockToDetailsCascade.value.delete(clockKey);
        } else if (clockChanged) {
          clock.Details.forEach((_, detailIdx) => {
            setSelected(
              `suggestions.${groupIdx}.Clocks.${clockIdx}.Details.${detailIdx}.Selected`,
              currentClockSelected ?? false,
            );
          });
        } else {
          let childChanged = false;
          clock.Details.forEach((detail, detailIdx) => {
            const detailKey = `${groupIdx}-${clockIdx}-${detailIdx}`;
            const prevDetailSelected = previousDetailSelected.value.get(detailKey);
            if (prevDetailSelected !== undefined && prevDetailSelected !== detail.Selected) {
              childChanged = true;
            }
          });

          if (childChanged) {
            const allSelected = clock.Details.every((d) => d.Selected);
            if (allSelected !== currentClockSelected) {
              suppressClockToDetailsCascade.value.add(clockKey);
              setSelected(`suggestions.${groupIdx}.Clocks.${clockIdx}.Selected`, allSelected);
            }
          }
        }

        previousClockSelected.value.set(clockKey, currentClockSelected ?? false);
        clock.Details.forEach((detail, detailIdx) => {
          const detailKey = `${groupIdx}-${clockIdx}-${detailIdx}`;
          previousDetailSelected.value.set(detailKey, detail.Selected ?? false);
        });
      });
    });

    selectedItems.value = getSelectedTrueObjects(newData);
  },
  { deep: true },
);

watch(
  () => timeEntriesStore.timeClocks,
  () => {
    resetForm({
      values: {
        suggestions: setInitialFormData(timeEntriesStore.timeClocks),
      },
    });
  },
  { immediate: true },
);

watch(
  () => [props.range.start, props.range.end, selectedHours.value],
  () => {
    fetchClocks();
  },
  { immediate: true },
);
</script>
