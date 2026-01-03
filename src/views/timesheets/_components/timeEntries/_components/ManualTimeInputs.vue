<template>
  <Transition name="slide-fade">
    <div v-if="visible" class="relative">
      <div class="flex items-center gap-3">
        <!-- Time Range -->
        <div
          class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border-1 border-transparent focus-within:border-f-primary focus-within:bg-white transition-all"
        >
          <i class="pi pi-clock text-sm" :class="[hasTimeError ? 'text-red-400' : 'text-gray-400']" />
          <FInput
            name="startTime"
            custom-class="unstyled time-input"
            :placeholder="t('pages.timesheets.enterTime.timeInput.placeholder')"
            :transform-value="transformTimeValue"
            unstyled
            hide-error
          />
          <span class="self-center" :class="[hasTimeError ? 'text-red-300' : 'text-gray-300']">-</span>
          <FInput
            name="endTime"
            custom-class="unstyled time-input"
            :placeholder="t('pages.timesheets.enterTime.timeInput.placeholder')"
            :transform-value="transformTimeValue"
            unstyled
            hide-error
          />
        </div>

        <!-- Date Picker -->
          <FDateTimePicker
            name="date"
            :number-of-months="1"
            :prime-props="{
              hourFormat: '24',
              fluid: true,
            }"
            hide-error
          />
      </div>

      <!-- Combined Time Error Message -->
      <small v-if="timeErrorMessage" class="absolute top-full left-0 mt-1 text-red-500 text-xs pl-1">
        {{ timeErrorMessage }}
      </small>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFieldError } from 'vee-validate';

import { transformTimeValue } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  visible: boolean;
}

defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();

const startTimeError = useFieldError('startTime');
const endTimeError = useFieldError('endTime');
const dateError = useFieldError('date');

const hasTimeError = computed(() => !!startTimeError.value || !!endTimeError.value);

const timeErrorMessage = computed(() => {
  if (startTimeError.value && endTimeError.value) {
    return t('pages.timesheets.enterTime.timeInput.bothRequired');
  }
  return startTimeError.value || endTimeError.value || dateError.value || '';
});
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
