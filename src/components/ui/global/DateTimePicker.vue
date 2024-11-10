<template>
  <div class="flex flex-col gap-2">
    <label :for="id">{{ label }}</label>
    <DatePicker
      v-model="value as any"
      :id="id"
      :data-error="!!errorMessage"
      :data-valid="isValid"
      :placeholder="placeholder"
      :disabled="disabled as boolean"
      class="w-full"
      :invalid="!!errorMessage"
      :class="[customClass]"
      v-bind="primeProps"
      :numberOfMonths="numberOfMonths"
      :manualInput="manualInput"
      format="dd/mm/yy"
    >
      <template #footer>
        <div v-if="primeProps?.selectionMode === 'range'" class="py-5 flex flex-wrap gap-2">
          <Button @click="handleChange(EFooterButton.TODAY)" class="w-[80px]">Today</Button>
          <Button @click="handleChange(EFooterButton.YESTERDAY)" class="w-[80px]">Yesterday</Button>
          <Button @click="handleChange(EFooterButton.LAST_7_DAYS)" class="w-[80px]"
            >Last 7 days</Button
          >
          <Button @click="handleChange(EFooterButton.LAST_30_DAYS)" class="w-[80px]"
            >Last 30 days</Button
          >
          <Button @click="handleChange(EFooterButton.THIS_MONTH)" class="w-[80px]"
            >This month</Button
          >
          <Button @click="handleChange(EFooterButton.PREVIOUS_MONTH)" class="w-[80px]"
            >Previous Month</Button
          >
          <Button @click="handleChange(EFooterButton.THIS_YEAR)" class="w-[80px]">This year</Button>
        </div>

        <slot name="customFooter" />
      </template>
    </DatePicker>
    <small :id="`${id}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
  </div>
  </input>
</template>

<script setup lang="ts">
import type { DatePickerProps } from 'primevue/datepicker';
import { computed } from 'vue';
import { useField } from 'vee-validate';
import dayjs from 'dayjs';

enum EFooterButton {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  PREVIOUS_MONTH = 'previous_year',
  THIS_YEAR = 'this_year',
}

interface IProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  customClass?: string;
  primeProps?: DatePickerProps;
  errorMessage?: string;
  customEvents?: Record<string, (e: Event) => any>;
  transformValue?: (value: InputEvent) => unknown;
  modelValue?: string;
  isValid?: boolean;
  disabled?: boolean;
  numberOfMonths?: number;
  manualInput?: boolean;
  format?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: 'Enter text',
  numberOfMonths: 2,
  manualInput: true,
  format: 'YY/MM/DDDD',
});


const {
  errorMessage: vError,
  value,
  handleBlur,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const handleChange = (btnType: EFooterButton) => {
  switch (btnType) {
    case EFooterButton.TODAY:
      value.value = [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()];
      break;
    case EFooterButton.YESTERDAY:
      value.value = [
        dayjs().subtract(1, 'day').startOf('day').toDate(),
        dayjs().subtract(1, 'day').endOf('day').toDate(),
      ];
      break;
    case EFooterButton.LAST_7_DAYS:
      value.value = [
        dayjs().subtract(7, 'day').startOf('day').toDate(),
        dayjs().endOf('day').toDate(),
      ];
      break;
    case EFooterButton.LAST_30_DAYS:
      value.value = [
        dayjs().subtract(30, 'day').startOf('day').toDate(),
        dayjs().endOf('day').toDate(),
      ];
      break;
    case EFooterButton.THIS_MONTH:
      value.value = [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()];
      break;
    case EFooterButton.PREVIOUS_MONTH:
      value.value = [
        dayjs().subtract(1, 'month').startOf('month').toDate(),
        dayjs().subtract(1, 'month').endOf('month').toDate(),
      ];
      break;
    case EFooterButton.THIS_YEAR:
      value.value = [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()];
      break;
    default:
      value.value = [new Date(), new Date()];
      break;
  }
};
</script>

<style scoped></style>
