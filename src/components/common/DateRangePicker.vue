<template>
  <DatePicker
    :modelValue="internalValue"
    :selectionMode="mode"
    :numberOfMonths="numberOfMonths"
    :maxDate="maxDate"
    :placeholder="resolvedPlaceholder"
    :dateFormat="dateFormat"
    showIcon
    iconDisplay="input"
    :class="$attrs.class"
    @update:modelValue="onCalendarChange"
  >
    <template #footer>
      <div
        class="flex flex-wrap gap-2 px-4 py-3 border-t border-border-secondary dark:border-border-primary bg-surface-tertiary/40 dark:bg-surface-secondary/40 rounded-b-md"
      >
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
          :class="
            activePresetId === preset.id
              ? 'bg-f-primary text-white border-f-primary shadow-sm'
              : 'bg-surface-primary dark:bg-surface-secondary text-content-secondary border-border-secondary dark:border-border-primary hover:bg-f-primary/10 hover:text-f-primary hover:border-f-primary/40'
          "
          @click="applyPreset(preset)"
        >
          {{ preset.label }}
        </button>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import DatePicker from 'primevue/datepicker';

import { type MessageSchema } from '@/plugins/i18n';

const props = withDefaults(defineProps<IProps>(), {
  mode: 'range',
  numberOfMonths: 2,
  maxDate: undefined,
  placeholder: '',
  dateFormat: 'dd.mm.yy',
});

const emit = defineEmits<IEmits>();

defineOptions({ inheritAttrs: false });

dayjs.extend(isoWeek);

/**
 * Wire shape: range mode emits `{ start, end }` (both Dates); single mode
 * emits a single `Date`. The component keeps an internal `Date[]` /
 * `Date` shape so PrimeVue's DatePicker stays untouched, and translates
 * at the prop/emit boundary. Presets always set both Start and End even
 * in single mode (where Start === End).
 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface IProps {
  modelValue: DateRange | Date | null;
  mode?: 'range' | 'single';
  numberOfMonths?: number;
  maxDate?: Date;
  placeholder?: string;
  dateFormat?: string;
}

interface IEmits {
  (e: 'update:modelValue', value: DateRange | Date | null): void;
  (e: 'preset', presetId: string): void;
}

const { t } = useI18n<{ message: MessageSchema }>();

const resolvedPlaceholder = computed(
  () => props.placeholder || t('components.dateRangePicker.placeholder'),
);

/**
 * Convert the outward-facing `DateRange | Date` model into the shape
 * PrimeVue's DatePicker expects (`Date[]` for range, single `Date` for
 * single). Null start/end stays null so the picker shows its placeholder.
 */
const internalValue = computed<Date[] | Date | null>(() => {
  if (props.mode === 'single') {
    return (props.modelValue as Date | null) ?? null;
  }
  const range = props.modelValue as DateRange | null;
  if (!range) return null;
  if (!range.start && !range.end) return null;
  return [range.start ?? null, range.end ?? null] as unknown as Date[];
});

const onCalendarChange = (next: Date | Date[] | (Date | null)[] | null | undefined) => {
  if (props.mode === 'single') {
    emit('update:modelValue', (next as Date | null) ?? null);
    activePresetId.value = null;
    return;
  }
  if (!Array.isArray(next)) {
    emit('update:modelValue', { start: null, end: null });
    activePresetId.value = null;
    return;
  }
  emit('update:modelValue', { start: next[0] ?? null, end: next[1] ?? null });
  activePresetId.value = null;
};

interface Preset {
  id: string;
  label: string;
  resolve: () => { start: Date; end: Date };
}

/**
 * Anchor presets on `dayjs()` so DST + month-end logic comes for free.
 * Week starts on Monday (locale-agnostic; matches the EU/TR convention
 * the rest of the worktime UI already uses).
 */
const presets = computed<Preset[]>(() => {
  const now = dayjs();
  return [
    {
      id: 'today',
      label: t('components.dateRangePicker.presets.today'),
      resolve: () => ({ start: now.startOf('day').toDate(), end: now.endOf('day').toDate() }),
    },
    {
      id: 'yesterday',
      label: t('components.dateRangePicker.presets.yesterday'),
      resolve: () => {
        const y = now.subtract(1, 'day');
        return { start: y.startOf('day').toDate(), end: y.endOf('day').toDate() };
      },
    },
    {
      id: 'thisWeek',
      label: t('components.dateRangePicker.presets.thisWeek'),
      resolve: () => ({
        start: now.startOf('isoWeek').toDate(),
        end: now.endOf('isoWeek').toDate(),
      }),
    },
    {
      id: 'lastWeek',
      label: t('components.dateRangePicker.presets.lastWeek'),
      resolve: () => {
        const lw = now.subtract(1, 'week');
        return { start: lw.startOf('isoWeek').toDate(), end: lw.endOf('isoWeek').toDate() };
      },
    },
    {
      id: 'thisMonth',
      label: t('components.dateRangePicker.presets.thisMonth'),
      resolve: () => ({
        start: now.startOf('month').toDate(),
        end: now.endOf('month').toDate(),
      }),
    },
    {
      id: 'lastMonth',
      label: t('components.dateRangePicker.presets.lastMonth'),
      resolve: () => {
        const lm = now.subtract(1, 'month');
        return { start: lm.startOf('month').toDate(), end: lm.endOf('month').toDate() };
      },
    },
  ];
});

const activePresetId = ref<string | null>(null);

const applyPreset = (preset: Preset) => {
  const { start, end } = preset.resolve();
  activePresetId.value = preset.id;
  if (props.mode === 'single') {
    emit('update:modelValue', start);
  } else {
    emit('update:modelValue', { start, end });
  }
  emit('preset', preset.id);
};

watch(
  () => props.modelValue,
  () => {
    /* user typed a custom date → clear active preset highlight */
    if (activePresetId.value !== null) activePresetId.value = null;
  },
  { deep: true },
);
</script>
