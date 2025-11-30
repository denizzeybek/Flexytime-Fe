<template>
  <Transition name="slide-fade">
    <div v-if="visible" class="flex items-center gap-3">
      <!-- Time Range -->
      <div
        class="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border-2 border-transparent focus-within:border-f-primary focus-within:bg-white transition-all"
      >
        <i class="pi pi-clock text-gray-400 text-sm" />
        <FInput
          name="startTime"
          custom-class="unstyled time-input"
          :placeholder="t('pages.timesheets.enterTime.timeInput.placeholder')"
          :transform-value="transformTimeValue"
          unstyled
        />
        <span class="text-gray-300">-</span>
        <FInput
          name="endTime"
          custom-class="unstyled time-input"
          :placeholder="t('pages.timesheets.enterTime.timeInput.placeholder')"
          :transform-value="transformTimeValue"
          unstyled
        />
      </div>

      <!-- Date Picker -->
      <div class="bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-f-primary">
        <FDateTimePicker
          name="date"
          :number-of-months="1"
          :prime-props="{
            hourFormat: '24',
            fluid: true,
          }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { transformTimeValue } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  visible: boolean;
}

defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
