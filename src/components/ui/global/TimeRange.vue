<template>
  <div class="relative">
    <div
      class="flex items-center gap-2 px-3 py-2 rounded-md border bg-white transition-colors"
      :class="[
        hasError ? 'border-red-500' : 'border-f-stroke',
        isFocused ? 'border-f-primary' : '',
      ]"
    >
      <i class="pi pi-clock text-sm" :class="[hasError ? 'text-red-400' : 'text-f-text-gray']" />
      <DatePicker
        v-model="startValue"
        time-only
        hour-format="24"
        :placeholder="placeholder"
        class="f-time-picker-minimal"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <span :class="[hasError ? 'text-red-300' : 'text-f-stroke']">-</span>
      <DatePicker
        v-model="endValue"
        time-only
        hour-format="24"
        :placeholder="placeholder"
        class="f-time-picker-minimal"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <small v-if="!hideError && errorMessage" class="absolute top-full left-0 mt-1 text-red-500 text-xs pl-1 whitespace-nowrap">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DatePicker from 'primevue/datepicker';
import { useField, useFieldError } from 'vee-validate';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  startName?: string;
  endName?: string;
  placeholder?: string;
  hideError?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  startName: 'startTime',
  endName: 'endTime',
  placeholder: '00:00',
  hideError: false,
});

const { t } = useI18n<{ message: MessageSchema }>();

const { value: startValue } = useField<Date | null>(() => props.startName, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const { value: endValue } = useField<Date | null>(() => props.endName, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const startError = useFieldError(() => props.startName);
const endError = useFieldError(() => props.endName);

const isFocused = ref(false);

const hasError = computed(() => !!startError.value || !!endError.value);

const errorMessage = computed(() => {
  if (startError.value && endError.value) {
    return t('pages.timesheets.enterTime.timeInput.bothRequired');
  }
  return startError.value || endError.value || '';
});
</script>

<style scoped>
.f-time-picker-minimal {
  width: 50px;
}

.f-time-picker-minimal :deep(.p-datepicker-input) {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  width: 50px !important;
  text-align: center;
  box-shadow: none !important;
}

.f-time-picker-minimal :deep(.p-datepicker-input:focus) {
  outline: none !important;
  box-shadow: none !important;
}
</style>
