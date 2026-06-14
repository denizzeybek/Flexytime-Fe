<template>
  <div
    class="group bg-surface-primary rounded-xl border-2 transition-all duration-300 overflow-hidden"
    :class="clock.Selected
      ? 'border-f-primary shadow-md shadow-f-primary/10'
      : 'border-border-secondary dark:border-border-primary hover:border-border-focus hover:shadow-sm'"
  >
    <div class="flex items-stretch">
      <div
        class="w-1.5 flex-shrink-0"
        :class="getDomainColor(clock.Domain)"
      />

      <div class="flex-1 p-3 min-w-0">
        <div class="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2.5">
          <FCheckbox
            :name="`suggestions[${groupIndex}].Clocks[${clockIndex}].Selected`"
            :indeterminate="indeterminate"
          />

          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :class="getDomainBgColor(clock.Domain)"
          >
            <i :class="getDomainIcon(clock.Domain)" class="text-sm" />
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-1.5 min-w-0">
              <span
                v-tooltip.top="clock.Name"
                class="text-sm font-semibold text-content-primary truncate"
              >{{ clock.Name }}</span>
              <Tag
                v-if="clock.Details?.length"
                :value="`+${clock.Details.length}`"
                severity="info"
                class="!text-[10px] !px-1.5 !py-0 flex-shrink-0"
              />
            </div>
            <p
              v-if="!clock.Details?.length && clock.Title"
              v-tooltip.top="clock.Title"
              class="text-xs text-content-tertiary truncate"
            >
              {{ clock.Title }}
            </p>
          </div>

          <span class="text-sm font-bold whitespace-nowrap text-right" :class="getDomainTextColor(clock.Domain)">
            {{ formatSpendTime(clock.Spend) }}
          </span>
        </div>

        <div v-if="clock.Details?.length" class="mt-3 pt-3 border-t border-border-secondary dark:border-border-primary">
          <div class="space-y-1.5">
            <div
              v-for="(detail, dIdx) in clock.Details"
              :key="dIdx"
              class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 p-2 rounded-md transition-colors"
              :class="detail.Selected ? 'bg-f-primary/5' : 'bg-surface-tertiary dark:bg-surface-secondary hover:bg-surface-secondary dark:hover:bg-surface-tertiary'"
            >
              <FCheckbox
                :name="`suggestions[${groupIndex}].Clocks[${clockIndex}].Details[${dIdx}].Selected`"
              />
              <div class="min-w-0">
                <p
                  v-tooltip.top="detail.Name"
                  class="text-xs font-medium text-content-secondary truncate"
                >{{ detail.Name }}</p>
                <p
                  v-if="detail.Title"
                  v-tooltip.top="detail.Title"
                  class="text-[11px] text-content-tertiary truncate"
                >{{ detail.Title }}</p>
              </div>
              <span class="text-xs font-medium text-content-secondary whitespace-nowrap text-right">{{ formatSpendTime(detail.Spend) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';

import { useSuggestionDomainHelpers } from '@/views/timesheets/_composables/useSuggestionDomainHelpers';

interface SuggestionClockDetail {
  ID?: string;
  Name?: string;
  Title?: string;
  Spend?: number;
  Selected?: boolean;
}

interface SuggestionClock {
  ID?: string;
  Name?: string;
  Title?: string;
  Spend?: number;
  Domain?: number;
  Selected?: boolean;
  Details?: SuggestionClockDetail[];
}

interface IProps {
  clock: SuggestionClock;
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
} = useSuggestionDomainHelpers();
</script>
