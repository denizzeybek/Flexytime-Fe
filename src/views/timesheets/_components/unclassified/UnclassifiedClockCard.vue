<template>
  <div
    class="group bg-surface-primary rounded-xl border-2 transition-all duration-300 overflow-hidden"
    :class="clock.Selected
      ? 'border-f-primary shadow-md shadow-f-primary/10'
      : 'border-border-secondary dark:border-border-primary hover:border-border-focus hover:shadow-md'"
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
            :name="`timeClocks[${groupIndex}].Clocks[${clockIndex}].Selected`"
            :indeterminate="indeterminate"
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
                <span class="font-semibold text-content-primary truncate">{{ clock.Name }}</span>
                <Tag
                  v-if="clock.Details?.length"
                  :value="`+${clock.Details.length}`"
                  severity="info"
                  class="!text-xs !px-1.5 !py-0.5"
                />
              </div>
              <p v-if="!clock.Details?.length && clock.Title" class="text-sm text-content-tertiary truncate">
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
        <div v-if="clock.Details?.length" class="mt-4 pt-4 border-t border-border-secondary dark:border-border-primary">
          <div class="space-y-2">
            <div
              v-for="(detail, dIdx) in clock.Details"
              :key="dIdx"
              class="flex items-center gap-3 p-3 rounded-lg transition-colors"
              :class="detail.Selected ? 'bg-f-primary/5' : 'bg-surface-tertiary dark:bg-surface-secondary hover:bg-surface-secondary dark:hover:bg-surface-tertiary'"
            >
              <FCheckbox
                :name="`timeClocks[${groupIndex}].Clocks[${clockIndex}].Details[${dIdx}].Selected`"
                class="flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-content-secondary truncate">{{ detail.Name }}</p>
                <p v-if="detail.Title" class="text-sm text-content-tertiary truncate">{{ detail.Title }}</p>
              </div>
              <span class="text-sm font-medium text-content-secondary">{{ formatSpendTime(detail.Spend) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';

import { useUnclassifiedDomainHelpers } from '@/views/timesheets/_composables/useUnclassifiedDomainHelpers';

import type { TimeClockViewModel } from '@/client';

interface FormTimeClock extends TimeClockViewModel {
  Selected?: boolean;
  Details?: Array<TimeClockViewModel & { Selected?: boolean }>;
}

interface IProps {
  clock: FormTimeClock;
  groupIndex: number;
  clockIndex: number;
  indeterminate?: boolean;
}

withDefaults(defineProps<IProps>(), {
  indeterminate: false,
});

const {
  getDomainColor,
  getDomainBgColor,
  getDomainTextColor,
  getDomainIcon,
  formatSpendTime,
} = useUnclassifiedDomainHelpers();
</script>
