<template>
  <div class="flex flex-col gap-6">
    <!-- Loading State -->
    <template v-if="timeEntriesStore.loading">
      <div v-for="i in 3" :key="i" class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <Skeleton shape="circle" size="2.5rem" />
          <div class="flex flex-col gap-1">
            <Skeleton height="1rem" width="6rem" />
            <Skeleton height="0.75rem" width="3rem" />
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5 ml-5">
          <div class="flex items-center gap-4">
            <Skeleton shape="circle" size="1.25rem" />
            <div class="flex-1">
              <Skeleton height="1.25rem" width="40%" class="mb-2" />
              <Skeleton height="0.875rem" width="60%" />
            </div>
            <Skeleton height="1.5rem" width="4rem" />
          </div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div
      v-else-if="!fields.length"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <div class="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <i class="pi pi-check-circle text-3xl text-emerald-500" />
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        {{ t('pages.timesheets.unclassified.emptyState.title') }}
      </h3>
      <p class="text-gray-500 text-center max-w-sm">
        {{ t('pages.timesheets.unclassified.emptyState.description') }}
      </p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Selected Summary Bar -->
      <Transition name="slide-down">
        <div
          v-if="selectedItems.length"
          class="sticky top-0 z-20 bg-f-primary text-white rounded-xl p-4 shadow-lg flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i class="pi pi-check-square text-lg" />
            </div>
            <div>
              <div class="font-semibold">{{ selectedItems.length }} {{ t('pages.timesheets.unclassified.itemsSelected') }}</div>
              <div class="text-sm opacity-80">{{ totalSelectedTime }}</div>
            </div>
          </div>
          <Button
            :label="t('pages.timesheets.unclassified.categorizeButton')"
            icon="pi pi-tag"
            class="!bg-white !text-f-primary hover:!bg-gray-100"
            @click="modalOpen = true"
          />
        </div>
      </Transition>

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
                <template v-for="(clock, tIdx) in field.value.Clocks" :key="tIdx">
                  <div
                    class="group bg-white rounded-xl border-2 transition-all duration-300 overflow-hidden"
                    :class="clock.Selected
                      ? 'border-f-primary shadow-md shadow-f-primary/10'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-md'"
                  >
                    <div class="flex items-stretch">
                      <!-- Domain Color Bar -->
                      <div
                        class="w-1.5 flex-shrink-0"
                        :class="getDomainColor(clock.Domain)"
                      />

                      <!-- Main Content -->
                      <div class="flex-1 p-4">
                        <div class="flex items-center gap-4">
                          <!-- Checkbox -->
                          <FCheckbox
                            :name="`timeClocks[${idx}].Clocks[${tIdx}].Selected`"
                            :indeterminate="isClockIndeterminate(idx, tIdx)"
                            class="flex-shrink-0"
                          />

                          <!-- App Icon & Info -->
                          <div class="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              :class="getDomainBgColor(clock.Domain)"
                            >
                              <i :class="getDomainIcon(clock.Domain)" class="text-lg" />
                            </div>

                            <div class="min-w-0 flex-1">
                              <div class="flex items-center gap-2">
                                <span class="font-semibold text-gray-800 truncate">{{ clock.Name }}</span>
                                <Tag
                                  v-if="clock.Details?.length"
                                  :value="`+${clock.Details.length}`"
                                  severity="info"
                                  class="!text-xs !px-1.5 !py-0.5"
                                />
                              </div>
                              <p v-if="!clock.Details?.length && clock.Title" class="text-sm text-gray-500 truncate">
                                {{ clock.Title }}
                              </p>
                            </div>
                          </div>

                          <!-- Time -->
                          <div class="flex flex-col items-end flex-shrink-0">
                            <span class="text-lg font-bold" :class="getDomainTextColor(clock.Domain)">
                              {{ formatSpendTime(clock.Spend) }}
                            </span>
                          </div>
                        </div>

                        <!-- Details (Expandable) -->
                        <div v-if="clock.Details?.length" class="mt-4 pt-4 border-t border-gray-100">
                          <div class="space-y-2">
                            <div
                              v-for="(detail, dIdx) in clock.Details"
                              :key="dIdx"
                              class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                              :class="detail.Selected ? 'bg-f-primary/5' : 'bg-gray-50 hover:bg-gray-100'"
                            >
                              <FCheckbox
                                :name="`timeClocks[${idx}].Clocks[${tIdx}].Details[${dIdx}].Selected`"
                                class="flex-shrink-0"
                              />
                              <div class="flex-1 min-w-0">
                                <p class="font-medium text-gray-700 truncate">{{ detail.Name }}</p>
                                <p v-if="detail.Title" class="text-sm text-gray-500 truncate">{{ detail.Title }}</p>
                              </div>
                              <span class="text-sm font-medium text-gray-600">{{ formatSpendTime(detail.Spend) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
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
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { useFieldArray, useForm } from 'vee-validate';
import { array, boolean, object } from 'yup';

import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

import UpdateTimeEntriesModal from '../_modals/UpdateTimeEntriesModal.vue';

import type { TimeClockGroupViewModel, TimeClockViewModel } from '@/client';

interface FormTimeClock extends TimeClockViewModel {
  Selected?: boolean;
  Details?: Array<TimeClockViewModel & { Selected?: boolean }>;
}

interface FormTimeClockGroup extends Omit<TimeClockGroupViewModel, 'Clocks'> {
  Clocks?: FormTimeClock[];
}

const { t } = useI18n<{ message: MessageSchema }>();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

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

// Domain constants
const DOMAIN = {
  WORK: 4,
  COMMUNICATION: 3,
  ENTERTAINMENT: 2,
  OTHER: 1,
};

const formatSpendTime = (spend?: number): string => {
  if (!spend) return '0m';
  const hours = Math.floor(spend / 3600);
  const minutes = Math.floor((spend % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getDomainColor = (domain?: number): string => {
  switch (domain) {
    case DOMAIN.WORK:
      return 'bg-emerald-500';
    case DOMAIN.COMMUNICATION:
      return 'bg-blue-500';
    case DOMAIN.ENTERTAINMENT:
      return 'bg-amber-500';
    default:
      return 'bg-gray-400';
  }
};

const getDomainBgColor = (domain?: number): string => {
  switch (domain) {
    case DOMAIN.WORK:
      return 'bg-emerald-100 text-emerald-600';
    case DOMAIN.COMMUNICATION:
      return 'bg-blue-100 text-blue-600';
    case DOMAIN.ENTERTAINMENT:
      return 'bg-amber-100 text-amber-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getDomainTextColor = (domain?: number): string => {
  switch (domain) {
    case DOMAIN.WORK:
      return 'text-emerald-600';
    case DOMAIN.COMMUNICATION:
      return 'text-blue-600';
    case DOMAIN.ENTERTAINMENT:
      return 'text-amber-600';
    default:
      return 'text-gray-600';
  }
};

const getDomainIcon = (domain?: number): string => {
  switch (domain) {
    case DOMAIN.WORK:
      return 'pi pi-briefcase';
    case DOMAIN.COMMUNICATION:
      return 'pi pi-comments';
    case DOMAIN.ENTERTAINMENT:
      return 'pi pi-play';
    default:
      return 'pi pi-desktop';
  }
};

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

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
