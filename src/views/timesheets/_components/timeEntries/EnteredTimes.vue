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

    <!-- Empty State -->
    <div
      v-else-if="!timeEntriesStore.timeEntries.length"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="pi pi-clock text-3xl text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        {{ t('pages.timesheets.enteredTimes.emptyState.title') }}
      </h3>
      <p class="text-gray-500 text-center max-w-sm">
        {{ t('pages.timesheets.enteredTimes.emptyState.description') }}
      </p>
    </div>

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

        <!-- Entry Cards -->
        <div
          v-for="entry in group.Entries"
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

                <!-- Right: Time Info -->
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                  <div class="text-2xl font-bold text-f-primary">
                    {{ entry.TimeSpanText }}
                  </div>
                  <div class="flex items-center gap-1.5 text-sm text-gray-500">
                    <i class="pi pi-clock text-xs" />
                    {{ entry.DateRangeText }}
                  </div>
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
                      class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm"
                    >
                      <span class="text-gray-600">{{ range.DateRangeText }}</span>
                      <span class="font-medium text-gray-800">{{ range.TimeSpanText }}</span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col justify-center gap-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                v-tooltip.left="t('common.buttons.edit')"
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                size="small"
              />
              <Button
                v-tooltip.left="t('common.buttons.delete')"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
              />
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

import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

const { t } = useI18n<{ message: MessageSchema }>();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const expandedRanges = ref<string[]>([]);

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
