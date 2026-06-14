<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex bg-surface-tertiary dark:bg-surface-primary rounded-xl p-1 gap-1">
        <button
          type="button"
          class="h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300"
          :class="
            isManualLayout
              ? 'bg-violet-500 text-white shadow-[0_0_22px_-2px_rgba(139,92,246,0.7)] dark:shadow-[0_0_22px_-2px_rgba(139,92,246,0.55)] ring-2 ring-violet-300/70 dark:ring-violet-400/40'
              : 'text-content-quaternary hover:text-content-secondary'
          "
          @click="$emit('update:activeLayout', 'manual')"
        >
          <i class="pi pi-list text-sm" />
          <span>{{ t('pages.timesheets.enterTime.layoutButtons.manual') }}</span>
        </button>
        <button
          type="button"
          class="h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300"
          :class="
            isTimerLayout
              ? 'bg-sky-500 text-white shadow-[0_0_22px_-2px_rgba(14,165,233,0.7)] dark:shadow-[0_0_22px_-2px_rgba(56,189,248,0.55)] ring-2 ring-sky-300/70 dark:ring-sky-400/40'
              : 'text-content-quaternary hover:text-content-secondary'
          "
          @click="$emit('update:activeLayout', 'timer')"
        >
          <i class="pi pi-clock text-sm" />
          <span>{{ t('pages.timesheets.enterTime.layoutButtons.timer') }}</span>
        </button>
      </div>

      <div
        class="min-w-[100px] h-11 px-4 rounded-xl flex items-center justify-center font-mono text-lg font-bold transition-all duration-200"
        :class="
          isRunning
            ? 'bg-f-primary/10 text-f-primary animate-pulse'
            : isManualLayout
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
              : 'bg-surface-tertiary text-content-secondary'
        "
      >
        {{ displayTime }}
      </div>

      <button
        type="button"
        class="h-11 px-4 rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-300"
        :class="
          isBillable
            ? 'bg-emerald-500 text-white shadow-[0_0_24px_-2px_rgba(16,185,129,0.65)] dark:shadow-[0_0_24px_-2px_rgba(16,185,129,0.5)] ring-2 ring-emerald-300/70 dark:ring-emerald-400/40'
            : 'bg-surface-tertiary dark:bg-surface-primary text-content-quaternary hover:bg-surface-secondary dark:hover:bg-surface-tertiary'
        "
        @click="$emit('update:isBillable', !isBillable)"
      >
        <i class="pi pi-dollar text-base" />
        <span>
          {{
            isBillable
              ? t('pages.timesheets.enterTime.billable.billable')
              : t('pages.timesheets.enterTime.billable.nonBillable')
          }}
        </span>
      </button>
    </div>

    <Button
      v-if="isTimerLayout"
      :severity="!isRunning ? 'info' : 'danger'"
      type="button"
      class="h-11 px-6 rounded-xl font-semibold transition-all duration-200"
      :class="isRunning ? 'animate-pulse' : ''"
      @click="isRunning ? $emit('stop') : $emit('start')"
    >
      <i :class="!isRunning ? 'pi pi-play' : 'pi pi-stop'" class="mr-2" />
      {{ !isRunning ? t('common.buttons.start') : t('common.buttons.stop') }}
    </Button>

    <Button
      v-if="isManualLayout"
      severity="info"
      type="submit"
      class="h-11 px-6 rounded-xl font-semibold"
    >
      <i class="pi pi-plus mr-2" />
      {{ t('common.buttons.add') }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  isBillable: boolean;
  isRunning: boolean;
  isTimerLayout: boolean;
  isManualLayout: boolean;
  displayTime: string;
}

interface IEmits {
  (e: 'update:isBillable', value: boolean): void;
  (e: 'update:activeLayout', value: 'timer' | 'manual'): void;
  (e: 'start'): void;
  (e: 'stop'): void;
}

defineProps<IProps>();
defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
