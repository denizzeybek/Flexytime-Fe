<template>
  <div class="flex items-center gap-3">
    <!-- Billable Toggle -->
    <button
      v-tooltip.top="isBillable ? 'Billable' : 'Not Billable'"
      type="button"
      class="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
      :class="
        isBillable
          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
      "
      @click="$emit('update:isBillable', !isBillable)"
    >
      <i class="pi pi-dollar text-lg" />
    </button>

    <!-- Manual Time Inputs Slot -->
    <slot name="manualInputs" />

    <!-- Time Display -->
    <div
      class="min-w-[100px] h-11 px-4 rounded-xl flex items-center justify-center font-mono text-lg font-bold transition-all duration-200"
      :class="
        isRunning
          ? 'bg-f-primary/10 text-f-primary animate-pulse'
          : isManualLayout
            ? 'bg-blue-50 text-blue-600'
            : 'bg-gray-100 text-gray-600'
      "
    >
      {{ displayTime }}
    </div>

    <!-- Timer Action Button -->
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

    <!-- Manual Add Button -->
    <Button
      v-if="isManualLayout"
      severity="info"
      type="submit"
      class="h-11 px-6 rounded-xl font-semibold"
    >
      <i class="pi pi-plus mr-2" />
      {{ t('common.buttons.add') }}
    </Button>

    <!-- Layout Toggle -->
    <div class="flex bg-gray-100 rounded-xl p-1 gap-1">
      <button
        v-tooltip.top="t('pages.timesheets.enterTime.layoutButtons.timer')"
        type="button"
        class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        :class="isTimerLayout ? 'bg-white text-f-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'"
        @click="$emit('update:activeLayout', 'timer')"
      >
        <i class="pi pi-clock" />
      </button>
      <button
        v-tooltip.top="t('pages.timesheets.enterTime.layoutButtons.manual')"
        type="button"
        class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        :class="isManualLayout ? 'bg-white text-f-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'"
        @click="$emit('update:activeLayout', 'manual')"
      >
        <i class="pi pi-list" />
      </button>
    </div>
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
