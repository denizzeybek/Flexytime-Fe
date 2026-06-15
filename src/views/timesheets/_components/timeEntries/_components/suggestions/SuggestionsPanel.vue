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
          <SuggestionEmptyState v-else-if="!form.fields.value.length" />
          <template v-else>
            <div class="flex flex-col gap-3">
              <div v-for="day in form.suggestionDays.value" :key="day.dayKey" class="flex flex-col gap-3">
                <div class="flex items-center gap-2 sticky top-0 z-10 w-full px-4 py-2 bg-surface-primary rounded-full shadow-sm border border-border-secondary dark:border-border-primary">
                  <button
                    type="button"
                    class="w-5 h-5 min-w-5 min-h-5 rounded-sm border flex items-center justify-center transition-colors flex-shrink-0"
                    :class="checkboxClass(form.daySelectionState(day))"
                    @click.stop="form.toggleDaySelection(day)"
                  >
                    <i v-if="form.daySelectionState(day).indeterminate" class="pi pi-minus text-white text-[10px]" />
                    <i v-else-if="form.daySelectionState(day).checked" class="pi pi-check text-white text-[10px]" />
                  </button>
                  <button
                    type="button"
                    class="flex-1 flex items-center justify-between gap-3 text-left"
                    @click="form.toggleDay(day.dayKey)"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <i class="pi pi-calendar text-f-primary text-xs" />
                      <span class="text-xs font-semibold text-content-secondary">{{ day.dayLabel }}</span>
                      <span class="text-content-tertiary/50">•</span>
                      <span class="text-xs text-content-tertiary">
                        {{ form.formatSpendTime(day.totalSeconds) }}
                      </span>
                    </div>
                    <i
                      class="pi text-content-tertiary text-[10px] transition-transform duration-200 flex-shrink-0"
                      :class="form.isDayExpanded(day.dayKey) ? 'pi-chevron-down' : 'pi-chevron-right'"
                    />
                  </button>
                </div>

                <div v-show="form.isDayExpanded(day.dayKey)" class="flex flex-col gap-4">
                  <div v-for="bucket in day.buckets" :key="bucket.fieldKey">
                    <div class="flex items-center gap-2 w-full mb-2 pl-4">
                      <button
                        type="button"
                        class="w-5 h-5 min-w-5 min-h-5 rounded-sm border flex items-center justify-center transition-colors flex-shrink-0"
                        :class="checkboxClass(form.bucketSelectionState(bucket))"
                        @click.stop="form.toggleBucketSelection(bucket)"
                      >
                        <i v-if="form.bucketSelectionState(bucket).indeterminate" class="pi pi-minus text-white text-[10px]" />
                        <i v-else-if="form.bucketSelectionState(bucket).checked" class="pi pi-check text-white text-[10px]" />
                      </button>
                      <button
                        type="button"
                        class="flex-1 flex items-center justify-between gap-2 text-left"
                        @click="form.toggleBucket(bucket.fieldKey)"
                      >
                        <div class="flex items-center gap-2">
                          <div class="w-8 h-8 rounded-lg bg-f-primary/10 flex items-center justify-center">
                            <i class="pi pi-clock text-f-primary text-sm" />
                          </div>
                          <div class="text-sm font-bold text-content-primary leading-tight">
                            {{ form.isAllDay.value ? day.dayLabel : formatBucketRange(bucket.recordDate, form.zone.value, form.selectedHours.value) }}
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <Tag
                            :value="form.bucketSlotLabel.value"
                            severity="secondary"
                            class="!text-[10px] !px-2 !py-0.5"
                          />
                          <i
                            class="pi text-content-tertiary text-[10px] transition-transform duration-200"
                            :class="form.isBucketExpanded(bucket.fieldKey) ? 'pi-chevron-down' : 'pi-chevron-right'"
                          />
                        </div>
                      </button>
                    </div>

                    <div v-show="form.isBucketExpanded(bucket.fieldKey)" class="flex flex-col gap-2 pl-2 border-l-2 border-border-secondary dark:border-border-primary">
                      <SuggestionClockCard
                        v-for="(clock, tIdx) in bucket.clocks"
                        :key="tIdx"
                        :clock="clock"
                        :group-index="bucket.groupIndex"
                        :clock-index="tIdx"
                        :indeterminate="form.isClockIndeterminate(bucket.groupIndex, tIdx)"
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
    v-model:open="form.convertOpen.value"
    :selected-items="form.selectedItems.value"
    :total-time="form.totalSelectedTime.value"
    :project-options="projectOptions"
    :tag-options="tagOptions"
    :task-options="taskOptions"
    @convert="form.onConvert"
    @clear="form.onClearSelection"
    @cancel="form.onModalCancel"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import Tag from 'primevue/tag';

import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

import { useSuggestionForm } from './_composables/useSuggestionForm';
import { checkboxClass, formatBucketRange } from './_helpers/suggestionData';
import SuggestionClockCard from './SuggestionClockCard.vue';
import SuggestionConvertModal from './SuggestionConvertModal.vue';
import SuggestionEmptyState from './SuggestionEmptyState.vue';
import SuggestionLoadingState from './SuggestionLoadingState.vue';

import type { DateRange } from '@/components/common/DateRangePicker.vue';
import type { MessageSchema } from '@/plugins/i18n';

interface IProps {
  range: DateRange;
  hours: number;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const projectOptions = computed(() => timeEntriesStore.projectOptions);
const tagOptions = computed(() => timeEntriesStore.tagOptions);
const taskOptions = computed(() => timeEntriesStore.taskOptions);

const form = useSuggestionForm({
  range: () => props.range,
  hours: () => props.hours,
});
</script>
