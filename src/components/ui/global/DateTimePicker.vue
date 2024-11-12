<template>
  <div class="flex flex-col gap-2">
    <label :for="id">{{ label }}</label>
    <div class="flex items-center gap-1">
      <Button v-if="showPrevNextButtons" @click="handleWeek(EWeek.PREV)" type="button" icon="pi pi-angle-left" />
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
            <Button v-for="(prop, idx) in buttonProps" :key="idx" @click="handleChange(prop.key)" class="w-[80px] !text-sm">
              {{prop.label}}
            </Button>
          </div>
        </template>
      </DatePicker>
      <Button v-if="showPrevNextButtons" @click="handleWeek(EWeek.NEXT)" type="button" icon="pi pi-angle-right" />
  </div>
    <small :id="`${id}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
  </div>
  </input>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { DatePickerProps } from 'primevue/datepicker';
import { useField } from 'vee-validate';
import { computed } from 'vue';

enum EHelperButton {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  PREVIOUS_MONTH = 'previous_year',
  THIS_YEAR = 'this_year'
}

enum EWeek {
  PREV = -1,
  NEXT = 1,
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
  showPrevNextButtons?:boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: 'Enter date',
  numberOfMonths: 2,
  manualInput: true,
  format: 'YY/MM/DDDD',
  showPrevNextButtons: false
});

const buttonProps = [
  {
    key: EHelperButton.TODAY,
    label: 'Today',
  },
  {
    key: EHelperButton.YESTERDAY,
    label: 'Yesterday',
  },
  {
    key: EHelperButton.LAST_7_DAYS,
    label: 'Last 7 days',
  },
  {
    key: EHelperButton.LAST_30_DAYS,
    label: 'Last 30 days',
  },
  {
    key: EHelperButton.THIS_MONTH,
    label: 'This month',
  },
  {
    key: EHelperButton.PREVIOUS_MONTH,
    label: 'Previous Month',
  },
  {
    key: EHelperButton.THIS_YEAR,
    label: 'This year',
  }
]

const {
  errorMessage: vError,
  value,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const handleChange = (btnType: EHelperButton) => {
  switch (btnType) {
    case EHelperButton.TODAY:
      value.value = [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()];
      break;
    case EHelperButton.YESTERDAY:
      value.value = [
        dayjs().subtract(1, 'day').startOf('day').toDate(),
        dayjs().subtract(1, 'day').endOf('day').toDate(),
      ];
      break;
    case EHelperButton.LAST_7_DAYS:
      value.value = [
        dayjs().subtract(7, 'day').startOf('day').toDate(),
        dayjs().endOf('day').toDate(),
      ];
      break;
    case EHelperButton.LAST_30_DAYS:
      value.value = [
        dayjs().subtract(30, 'day').startOf('day').toDate(),
        dayjs().endOf('day').toDate(),
      ];
      break;
    case EHelperButton.THIS_MONTH:
      value.value = [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()];
      break;
    case EHelperButton.PREVIOUS_MONTH:
      value.value = [
        dayjs().subtract(1, 'month').startOf('month').toDate(),
        dayjs().subtract(1, 'month').endOf('month').toDate(),
      ];
      break;
    case EHelperButton.THIS_YEAR:
      value.value = [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()];
      break;
    default:
      value.value = [new Date(), new Date()];
      break;
  }
};

const handleWeek = (week: EWeek) => {
  const startDate = dayjs((value.value as string[])[0]);
  const endDate = dayjs((value.value as string[])[1]);
  if (week === EWeek.PREV) {
    value.value = [startDate.subtract(1, 'week').toDate(), endDate.subtract(1, 'week').toDate()];
  } else {
    value.value = [startDate.add(1, 'week').toDate(), endDate.add(1, 'week').toDate()];
  }
};
</script>

<style scoped></style>
