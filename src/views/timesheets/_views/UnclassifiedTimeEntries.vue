<template>
  <div class="flex flex-col gap-6">
    <!-- Loading State -->
    <UnclassifiedLoadingState v-if="timeEntriesStore.loading" />

    <!-- Empty State -->
    <UnclassifiedEmptyState v-else-if="!fields.length" />

    <!-- Content -->
    <template v-else>
      <!-- Selected Summary Bar -->
      <UnclassifiedSelectionBar
        :selected-count="selectedItems.length"
        :total-time="totalSelectedTime"
        @categorize="modalOpen = true"
      />

      <!-- Timeline -->
      <div class="relative" :class="selectedItems.length ? 'mt-4' : ''">
        <template v-for="(field, idx) in fields" :key="field.key">
          <!-- Time Group Header -->
          <div class="flex items-start gap-4 mb-4">
            <!-- Timeline Node -->
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full bg-f-primary/10 border-2 border-f-primary flex items-center justify-center flex-shrink-0">
                <i class="pi pi-clock text-f-primary" />
              </div>
              <div class="w-0.5 flex-1 bg-gray-200 mt-2" />
            </div>

            <!-- Time Info -->
            <div class="flex-1 pb-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-lg font-bold text-gray-800">{{ field.value.RecordTime }}</span>
                <span class="text-sm text-gray-500">{{ field.value.RecordDate }}</span>
              </div>

              <!-- Clock Cards -->
              <div class="flex flex-col gap-3">
                <UnclassifiedClockCard
                  v-for="(clock, tIdx) in field.value.Clocks"
                  :key="tIdx"
                  :clock="clock"
                  :group-index="idx"
                  :clock-index="tIdx"
                  :indeterminate="isClockIndeterminate(idx, tIdx)"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>

  <!-- Categorize Modal -->
  <UpdateTimeEntriesModal
    v-if="modalOpen && selectedItems.length"
    v-model:open="modalOpen"
    :data="selectedItems"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useFieldArray, useForm } from 'vee-validate';
import { array, boolean, object } from 'yup';

import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import UnclassifiedClockCard from '@/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue';
import UnclassifiedEmptyState from '@/views/timesheets/_components/unclassified/UnclassifiedEmptyState.vue';
import UnclassifiedLoadingState from '@/views/timesheets/_components/unclassified/UnclassifiedLoadingState.vue';
import UnclassifiedSelectionBar from '@/views/timesheets/_components/unclassified/UnclassifiedSelectionBar.vue';
import { useUnclassifiedDomainHelpers } from '@/views/timesheets/_composables/useUnclassifiedDomainHelpers';

import UpdateTimeEntriesModal from '../_modals/UpdateTimeEntriesModal.vue';

import type { TimeClockGroupViewModel, TimeClockViewModel } from '@/client';

interface FormTimeClock extends TimeClockViewModel {
  Selected?: boolean;
  Details?: Array<TimeClockViewModel & { Selected?: boolean }>;
}

interface FormTimeClockGroup extends Omit<TimeClockGroupViewModel, 'Clocks'> {
  Clocks?: FormTimeClock[];
}

const timeEntriesStore = useTimesheetsTimeEntriesStore();
const { formatSpendTime } = useUnclassifiedDomainHelpers();

const validationSchema = object({
  selectAll: boolean().nullable().label('Select All'),
  timeClocks: array().of(
    object().shape({
      Clocks: array().of(
        object().shape({
          Selected: boolean().nullable().label('Selected'),
          Details: array().of(
            object().shape({
              Selected: boolean().nullable().label('Selected'),
            }),
          ),
        }),
      ),
    }),
  ),
});

const { resetForm, setFieldValue } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<FormTimeClockGroup>('timeClocks');

// Track previous values to detect changes
const previousClockSelected = ref<Map<string, boolean>>(new Map());
const previousDetailSelected = ref<Map<string, boolean>>(new Map());

const modalOpen = ref(false);
const selectedItems = ref<FormTimeClock[]>([]);

const totalSelectedTime = computed(() => {
  const totalSeconds = selectedItems.value.reduce((acc, item) => acc + (item.Spend || 0), 0);
  return formatSpendTime(totalSeconds);
});

// Check if a parent clock is in indeterminate state (some but not all children selected)
const isClockIndeterminate = (groupIdx: number, clockIdx: number): boolean => {
  const clock = fields.value[groupIdx]?.value?.Clocks?.[clockIdx];
  if (!clock?.Details?.length) return false;

  const selectedCount = clock.Details.filter((d) => d.Selected).length;
  return selectedCount > 0 && selectedCount < clock.Details.length;
};

const setInitialFormData = (data: TimeClockGroupViewModel[]): FormTimeClockGroup[] => {
  return data?.map((group) => ({
    RecordDate: group.RecordDate,
    RecordTime: group.RecordTime,
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

const hasSelectedTrue = (data: FormTimeClockGroup[]): boolean => {
  for (const group of data) {
    if (!group.Clocks) continue;

    for (const clock of group.Clocks) {
      if (clock.Selected) return true;

      if (clock.Details) {
        for (const detail of clock.Details) {
          if (detail.Selected) return true;
        }
      }
    }
  }
  return false;
};

const getSelectedTrueObjects = (data: FormTimeClockGroup[]): FormTimeClock[] => {
  const selected: FormTimeClock[] = [];

  data?.forEach((group) => {
    group.Clocks?.forEach((clock) => {
      if (!clock.Details?.length) {
        if (clock.Selected) {
          selected.push(clock);
        }
      } else {
        clock.Details?.forEach((detail) => {
          if (detail.Selected) {
            selected.push(detail as FormTimeClock);
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

const setModalState = () => {
  const data = setInitialFormData(timeEntriesStore.timeClocks);
  if (hasSelectedTrue(data)) {
    selectedItems.value = getSelectedTrueObjects(data);
  } else {
    modalOpen.value = false;
  }
};

// Parent-child checkbox synchronization
watch(
  () => fields.value,
  (newValue) => {
    const newData = newValue.map((element) => element.value);

    // Handle parent-child sync
    newData.forEach((group, groupIdx) => {
      group.Clocks?.forEach((clock, clockIdx) => {
        if (!clock.Details?.length) return;

        const clockKey = `${groupIdx}-${clockIdx}`;
        const prevClockSelected = previousClockSelected.value.get(clockKey);
        const currentClockSelected = clock.Selected;

        // Check if parent was just clicked (changed from previous state)
        if (prevClockSelected !== undefined && prevClockSelected !== currentClockSelected) {
          // Parent was clicked - sync all children to parent state
          clock.Details.forEach((_, detailIdx) => {
            setFieldValue(
              `timeClocks[${groupIdx}].Clocks[${clockIdx}].Details[${detailIdx}].Selected`,
              currentClockSelected,
            );
          });
        } else {
          // Check if any child changed
          let childChanged = false;
          clock.Details.forEach((detail, detailIdx) => {
            const detailKey = `${groupIdx}-${clockIdx}-${detailIdx}`;
            const prevDetailSelected = previousDetailSelected.value.get(detailKey);
            if (prevDetailSelected !== undefined && prevDetailSelected !== detail.Selected) {
              childChanged = true;
            }
          });

          if (childChanged) {
            // Child changed - update parent based on children state
            const allSelected = clock.Details.every((d) => d.Selected);
            const noneSelected = clock.Details.every((d) => !d.Selected);

            if (allSelected && !currentClockSelected) {
              setFieldValue(`timeClocks[${groupIdx}].Clocks[${clockIdx}].Selected`, true);
            } else if (noneSelected && currentClockSelected) {
              setFieldValue(`timeClocks[${groupIdx}].Clocks[${clockIdx}].Selected`, false);
            }
          }
        }

        // Update previous values for next comparison
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
    setModalState();
    resetForm({
      values: {
        timeClocks: setInitialFormData(timeEntriesStore.timeClocks),
        selectAll: false,
      },
    });
  },
  {
    immediate: true,
  },
);
</script>
