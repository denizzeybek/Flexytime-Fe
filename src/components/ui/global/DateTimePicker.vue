<template>
  <div class="flex flex-col" :class="[hideError && !label ? '' : 'gap-2']">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="flex items-center gap-1">
      <Button v-if="showPrevNextButtons" type="button" icon="pi pi-angle-left" @click="handleWeek(EWeek.PREV)" />
      <DatePicker
        :id="id"
        v-model="value"
        :data-error="!!errorMessage"
        :data-valid="isValid"
        :placeholder="finalPlaceholder"
        :disabled="disabled"
        class="w-full"
        :invalid="!!errorMessage"
        :class="[customClass]"
        v-bind="primeProps"
        :numberOfMonths="numberOfMonths"
        :manualInput="manualInput"
        :date-format="dateFormat"
        @value-change="handleChangeEvent"
      >
        <template #footer>
          <div v-if="primeProps?.selectionMode === 'range'" class="py-5 flex flex-wrap gap-2">
            <Button v-for="(prop, idx) in buttonProps" :key="idx" class="w-[80px] !text-sm" @click="handleChange(prop.key)">
              {{prop.label}}
            </Button>
          </div>
        </template>
      </DatePicker>
      <Button v-if="showPrevNextButtons" type="button" icon="pi pi-angle-right" @click="handleWeek(EWeek.NEXT)" />
  </div>
    <small v-if="!hideError" :id="`${id}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import { useField } from 'vee-validate';

import { useDateFormat } from '@/composables/useDateFormat';
import { type MessageSchema } from '@/plugins/i18n';

import type { DatePickerProps } from 'primevue/datepicker';

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
  showPrevNextButtons?: boolean;
  hideError?: boolean;
}

type DatePickerValue = Date | Date[] | (Date | null)[] | null | undefined;

interface IEmits {
  (event: 'change', value: DatePickerValue): void;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: '',
  numberOfMonths: 2,
  manualInput: true,
  format: 'YY/MM/DDDD',
  showPrevNextButtons: false,
  hideError: false,
});

const emit = defineEmits<IEmits>();

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

const { t } = useI18n<{ message: MessageSchema }>();
const { dateFormat } = useDateFormat();

const {
  errorMessage: vError,
  value,
} = useField<Date | Date[] | (Date | null)[] | null>(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const finalPlaceholder = computed(() => props.placeholder || t('components.dateTimePicker.placeholder'));

const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const buttonProps = computed(() => [
  {
    key: EHelperButton.TODAY,
    label: t('components.dateTimePicker.today'),
  },
  {
    key: EHelperButton.YESTERDAY,
    label: t('components.dateTimePicker.yesterday'),
  },
  {
    key: EHelperButton.LAST_7_DAYS,
    label: t('components.dateTimePicker.last7Days'),
  },
  {
    key: EHelperButton.LAST_30_DAYS,
    label: t('components.dateTimePicker.last30Days'),
  },
  {
    key: EHelperButton.THIS_MONTH,
    label: t('components.dateTimePicker.thisMonth'),
  },
  {
    key: EHelperButton.PREVIOUS_MONTH,
    label: t('components.dateTimePicker.previousMonth'),
  },
  {
    key: EHelperButton.THIS_YEAR,
    label: t('components.dateTimePicker.thisYear'),
  }
])

const handleChangeEvent = () => {
  emit('change', value.value);  // Emit value on change
};

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
  if (!value.value || !Array.isArray(value.value)) return;

  const startDate = dayjs(value.value[0]);
  const endDate = dayjs(value.value[1]);

  if (week === EWeek.PREV) {
    value.value = [startDate.subtract(1, 'week').toDate(), endDate.subtract(1, 'week').toDate()];
  } else {
    value.value = [startDate.add(1, 'week').toDate(), endDate.add(1, 'week').toDate()];
  }
};
</script>

<style scoped></style>
