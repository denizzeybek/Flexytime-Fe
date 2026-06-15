import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFieldArray, useForm } from 'vee-validate';

import { TimesheetService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { useSuggestionDomainHelpers } from '@/views/timesheets/_composables/useSuggestionDomainHelpers';

import {
  countLeaves,
  dayKeyFor,
  dayLabelFor,
  getSelectedTrueObjects,
  setInitialFormData,
  sumBucketSeconds,
  type DayBucket,
  type DayGroup,
  type SelectionState,
  type SuggestionClockForm,
  type SuggestionForm,
  type SuggestionGroupForm,
} from '../_helpers/suggestionData';

import type { DateRange } from '@/components/common/DateRangePicker.vue';

interface UseSuggestionFormOptions {
  range: () => DateRange;
  hours: () => number;
}

export const useSuggestionForm = (options: UseSuggestionFormOptions) => {
  const { t } = useI18n<{ message: MessageSchema }>();
  const timeEntriesStore = useTimesheetsTimeEntriesStore();
  const profileStore = useProfileStore();
  const { formatSpendTime } = useSuggestionDomainHelpers();
  const { showSuccessMessage, showErrorMessage } = useFToast();

  const { resetForm, setFieldValue } = useForm<SuggestionForm>({
    initialValues: { suggestions: [] },
  });
  const setSelected = (path: string, value: boolean) => {
    (setFieldValue as (p: string, v: boolean) => void)(path, value);
  };

  const { fields, update: updateField } = useFieldArray<SuggestionGroupForm>('suggestions');

  const selectedHours = computed(() => options.hours());
  const isAllDay = computed(() => selectedHours.value === 24);
  const bucketSlotLabel = computed(() => {
    const h = selectedHours.value;
    return h === 24 ? t('pages.timesheets.timeEntries.suggestions.allDaySlot') : `${h}h slot`;
  });

  const zone = computed(() => profileStore.TimeZone || undefined);
  const dateLabels = computed(() => ({
    today: t('common.dates.today'),
    yesterday: t('common.dates.yesterday'),
  }));

  const previousClockSelected = ref<Map<string, boolean>>(new Map());
  const previousDetailSelected = ref<Map<string, boolean>>(new Map());
  const suppressClockToDetailsCascade = ref<Set<string>>(new Set());

  const selectedItems = ref<SuggestionClockForm[]>([]);
  const collapsedBuckets = ref<Set<string>>(new Set());
  const collapsedDays = ref<Set<string>>(new Set());
  const convertOpen = ref(false);

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

  const bucketSelectionState = (bucket: DayBucket): SelectionState => {
    const { total, selected } = countLeaves(bucket.clocks);
    if (total === 0 || selected === 0) return { checked: false, indeterminate: false };
    if (selected === total) return { checked: true, indeterminate: false };
    return { checked: false, indeterminate: true };
  };

  const daySelectionState = (day: DayGroup): SelectionState => {
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
    applyBucketSelection(bucket.groupIndex, !bucketSelectionState(bucket).checked);
  };

  const toggleDaySelection = (day: DayGroup): void => {
    const willCheck = !daySelectionState(day).checked;
    for (const bucket of day.buckets) applyBucketSelection(bucket.groupIndex, willCheck);
  };

  const suggestionDays = computed<DayGroup[]>(() => {
    const map = new Map<string, DayGroup>();
    fields.value.forEach((field, idx) => {
      const recordDate = field.value?.RecordDate;
      if (!recordDate) return;
      const dayKey = dayKeyFor(recordDate, zone.value);
      let day = map.get(dayKey);
      if (!day) {
        day = {
          dayKey,
          dayLabel: dayLabelFor(recordDate, zone.value, dateLabels.value),
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

  const isClockIndeterminate = (groupIdx: number, clockIdx: number): boolean => {
    const clock = fields.value[groupIdx]?.value?.Clocks?.[clockIdx];
    if (!clock?.Details?.length) return false;
    const selectedCount = clock.Details.filter((d) => d.Selected).length;
    return selectedCount > 0 && selectedCount < clock.Details.length;
  };

  const fetchClocks = async () => {
    const range = options.range();
    const start = range.start;
    const end = range.end;
    if (!start || !end) return;
    await timeEntriesStore.fetchTimeClocksRange(start, end, selectedHours.value);
  };

  const onClearSelection = () => {
    resetForm({
      values: { suggestions: setInitialFormData(timeEntriesStore.timeClocks) },
    });
  };

  const onModalCancel = () => {
    if (selectedItems.value.length > 0) onClearSelection();
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
          const first =
            result?.Errors?.[0]?.Message ??
            t('pages.timesheets.timeEntries.suggestions.modal.saveFailed');
          showErrorMessage(new Error(first));
          return;
        }
      }
      showSuccessMessage(t('pages.timesheets.timeEntries.suggestions.convertSuccess'));
      onClearSelection();
      await Promise.all([timeEntriesStore.refreshLastEntries(), fetchClocks()]);
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
          const clockChanged =
            prevClockSelected !== undefined && prevClockSelected !== currentClockSelected;
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
                setSelected(
                  `suggestions.${groupIdx}.Clocks.${clockIdx}.Selected`,
                  allSelected,
                );
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
        values: { suggestions: setInitialFormData(timeEntriesStore.timeClocks) },
      });
    },
    { immediate: true },
  );

  watch(
    () => [options.range().start, options.range().end, selectedHours.value],
    () => {
      fetchClocks();
    },
    { immediate: true },
  );

  return {
    fields,
    selectedHours,
    isAllDay,
    bucketSlotLabel,
    zone,
    selectedItems,
    convertOpen,
    suggestionDays,
    totalSelectedTime,
    isBucketExpanded,
    toggleBucket,
    isDayExpanded,
    toggleDay,
    bucketSelectionState,
    daySelectionState,
    toggleBucketSelection,
    toggleDaySelection,
    isClockIndeterminate,
    onClearSelection,
    onModalCancel,
    onConvert,
    formatSpendTime,
  };
};
