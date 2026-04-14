<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- Billable Toggle -->
    <button
      v-tooltip.top="isBillable ? t('pages.timesheets.enterTime.billable.billable') : t('pages.timesheets.enterTime.billable.nonBillable')"
      type="button"
      class="order-3 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
      :class="
        isBillable
          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/50'
          : 'bg-surface-tertiary dark:bg-surface-secondary text-content-quaternary hover:bg-surface-secondary dark:hover:bg-surface-tertiary'
      "
      @click="$emit('update:isBillable', !isBillable)"
    >
      <i class="pi pi-dollar text-lg" />
    </button>

    <!-- Manual Time Inputs Slot -->
    <div class="order-1">
      <slot name="manualInputs" />
    </div>

    <!-- Time Display -->
    <div
      class="order-2 grow lg:grow-0 min-w-[100px] h-11 px-4 rounded-xl flex items-center justify-center font-mono text-lg font-bold transition-all duration-200"
      :class="
        isRunning
          ? 'bg-f-primary/10 text-f-primary animate-pulse'
          : isManualLayout
            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
            : 'bg-surface-tertiary dark:bg-surface-secondary text-content-secondary'
      "
    >
      {{ displayTime }}
    </div>

    <!-- Layout Toggle -->
    <div class="order-4 flex bg-surface-tertiary dark:bg-surface-secondary rounded-xl p-1 gap-1">
      <button
        v-tooltip.top="t('pages.timesheets.enterTime.layoutButtons.manual')"
        type="button"
        class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        :class="isManualLayout ? 'bg-surface-primary text-f-primary shadow-sm' : 'text-content-quaternary hover:text-content-secondary'"
        @click="$emit('update:activeLayout', 'manual')"
      >
        <i class="pi pi-list" />
      </button>
      <button
        v-tooltip.top="t('pages.timesheets.enterTime.layoutButtons.timer')"
        type="button"
        class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        :class="isTimerLayout ? 'bg-surface-primary text-f-primary shadow-sm' : 'text-content-quaternary hover:text-content-secondary'"
        @click="$emit('update:activeLayout', 'timer')"
      >
        <i class="pi pi-clock" />
      </button>
    </div>

    <!-- Timer Action Button -->
    <Button
      v-if="isTimerLayout"
      :severity="!isRunning ? 'info' : 'danger'"
      type="button"
      class="order-5 grow lg:grow-0 h-11 px-6 rounded-xl font-semibold transition-all duration-200"
      :class="isRunning ? 'animate-pulse' : ''"
      @click="isRunning ? $emit('stop') : $emit('start')"
    >
      <i :class="!isRunning ? 'pi pi-play' : 'pi pi-stop'" class="mr-2" />
      {{ !isRunning ? t('common.buttons.start') : t('common.buttons.stop') }}
    </Button>

    <!-- Manual Add Button -->
    <Button
      v-if="isManualLayout"
      severity="info"
      type="submit"
      class="order-5 grow lg:grow-0 h-11 px-6 rounded-xl font-semibold"
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
