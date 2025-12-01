<template>
  <div class="flex flex-col gap-6">
    <!-- Loading State -->
    <template v-if="timeEntriesStore.loading">
      <div v-for="i in 3" :key="i" class="flex flex-col gap-4">
        <Skeleton height="1.5rem" width="8rem" class="mx-auto" />
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-3 flex-1">
              <Skeleton height="1.25rem" width="60%" />
              <div class="flex gap-2">
                <Skeleton height="1.5rem" width="5rem" borderRadius="1rem" />
                <Skeleton height="1.5rem" width="4rem" borderRadius="1rem" />
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <Skeleton height="1rem" width="6rem" />
              <Skeleton height="1.5rem" width="4rem" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <template v-else>
      <div v-for="group in timeEntriesStore.timeEntries" :key="group.RecordDate" class="flex flex-col gap-4">
        <!-- Date Divider -->
        <div class="flex items-center gap-3 sticky top-0 bg-gray-50/95 backdrop-blur-sm py-2 z-10">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <div class="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
            <i class="pi pi-calendar text-f-primary text-sm" />
            <span class="text-sm font-semibold text-gray-700">{{ formatDateLabel(group.RecordDate) }}</span>
          </div>
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        <!-- Empty State for this date -->
        <NoDataState
          v-if="!group.Entries?.length"
          :message="t('pages.timesheets.enteredTimes.emptyState.title')"
        />

        <!-- Entry Cards -->
        <div
          v-for="entry in group.Entries"
          v-else
          :key="entry.ID"
          class="group bg-white rounded-2xl border border-gray-100 hover:border-f-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div class="flex">
            <!-- Time Indicator Bar -->
            <div class="w-1.5 bg-gradient-to-b from-f-primary to-f-primary/60" />

            <!-- Content -->
            <div class="flex-1 p-5">
              <div class="flex items-start justify-between gap-4">
                <!-- Left: Task Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-xl bg-f-primary/10 flex items-center justify-center flex-shrink-0">
                      <i class="pi pi-briefcase text-f-primary" />
                    </div>
                    <div class="min-w-0">
                      <h4 class="font-semibold text-gray-800 truncate">
                        {{ entry.Task?.Name || t('pages.timesheets.enteredTimes.untitled') }}
                      </h4>
                      <p v-if="entry.Project?.Name" class="text-sm text-gray-500 flex items-center gap-1">
                        <i class="pi pi-folder text-xs" />
                        {{ entry.Project.Name }}
                      </p>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div v-if="entry.Tags?.length" class="flex flex-wrap gap-2">
                    <Tag
                      v-for="tag in entry.Tags"
                      :key="tag.ID"
                      :value="tag.Name"
                      severity="secondary"
                      class="!text-xs !px-2.5 !py-1"
                    />
                  </div>
                </div>

                <!-- Right: Time Info + Delete -->
                <div class="flex items-start gap-3 flex-shrink-0">
                  <div class="flex flex-col items-end gap-1">
                    <div class="text-2xl font-bold text-f-primary">
                      {{ entry.TimeSpanText }}
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-gray-500">
                      <i class="pi pi-clock text-xs" />
                      {{ entry.DateRangeText }}
                    </div>
                  </div>
                  <Button
                    v-tooltip.left="t('common.buttons.delete')"
                    :icon="deletingId === entry.ID ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
                    severity="danger"
                    text
                    rounded
                    size="small"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                    :disabled="deletingId === entry.ID"
                    @click="handleDeleteEntry(entry.ID!, entry.Task?.Name)"
                  />
                </div>
              </div>

              <!-- Ranges (Expandable) -->
              <div v-if="entry.Ranges?.length" class="mt-4 pt-4 border-t border-gray-100">
                <button
                  class="flex items-center gap-2 text-sm text-gray-600 hover:text-f-primary transition-colors mb-3"
                  @click="entry.ID && toggleRanges(entry.ID)"
                >
                  <i
                    class="pi transition-transform duration-200"
                    :class="expandedRanges.includes(entry.ID!) ? 'pi-chevron-down' : 'pi-chevron-right'"
                  />
                  <span>{{ entry.Ranges.length }} {{ t('pages.timesheets.enteredTimes.sessions') }}</span>
                </button>

                <Transition name="slide-fade">
                  <div v-if="expandedRanges.includes(entry.ID!)" class="space-y-2 pl-4 border-l-2 border-f-primary/20">
                    <div
                      v-for="range in entry.Ranges"
                      :key="range.ID"
                      class="group/range flex items-center justify-between py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                    >
                      <span class="text-gray-600">{{ range.DateRangeText }}</span>
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-800">{{ range.TimeSpanText }}</span>
                        <Button
                          v-tooltip.left="t('common.buttons.delete')"
                          :icon="deletingRangeId === range.ID ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
                          severity="danger"
                          text
                          rounded
                          size="small"
                          class="!w-7 !h-7 opacity-0 group-hover/range:opacity-100 transition-opacity"
                          :disabled="deletingRangeId === range.ID"
                          @click.stop="handleDeleteRange(range.ID!, entry.Task?.Name)"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';

import NoDataState from '@/components/common/NoDataState.vue';
import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const confirm = useConfirm();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const expandedRanges = ref<string[]>([]);
const deletingId = ref<string | null>(null);
const deletingRangeId = ref<string | null>(null);

const toggleRanges = (entryId: string) => {
  const index = expandedRanges.value.indexOf(entryId);
  if (index > -1) {
    expandedRanges.value.splice(index, 1);
  } else {
    expandedRanges.value.push(entryId);
  }
};

const formatDateLabel = (dateStr?: string): string => {
  if (!dateStr) return '';

  const date = dayjs(dateStr, 'DD.MM.YYYY');
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'day');

  if (date.isSame(today, 'day')) {
    return t('common.dates.today');
  } else if (date.isSame(yesterday, 'day')) {
    return t('common.dates.yesterday');
  }

  return date.format('DD MMMM YYYY');
};

const handleDeleteEntry = (entryId: string, taskName?: string) => {
  confirm.require({
    message: t('pages.timesheets.enteredTimes.deleteConfirm.message', { task: taskName || t('pages.timesheets.enteredTimes.untitled') }),
    header: t('pages.timesheets.enteredTimes.deleteConfirm.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        deletingId.value = entryId;
        await timeEntriesStore.deleteTimeEntry(entryId);
        showSuccessMessage(t('pages.timesheets.enteredTimes.deleteConfirm.success'));
      } catch (error) {
        showErrorMessage(error as Error);
      } finally {
        deletingId.value = null;
      }
    },
  });
};

const handleDeleteRange = (rangeId: string, taskName?: string) => {
  confirm.require({
    message: t('pages.timesheets.enteredTimes.deleteRangeConfirm.message', { task: taskName || t('pages.timesheets.enteredTimes.untitled') }),
    header: t('pages.timesheets.enteredTimes.deleteRangeConfirm.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        deletingRangeId.value = rangeId;
        await timeEntriesStore.deleteTimeEntryRange(rangeId);
        showSuccessMessage(t('pages.timesheets.enteredTimes.deleteRangeConfirm.success'));
      } catch (error) {
        showErrorMessage(error as Error);
      } finally {
        deletingRangeId.value = null;
      }
    },
  });
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
