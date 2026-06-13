<template>
  <div class="flex gap-2.5 items-center w-full lg:w-fit">
    <Button
      v-if="canAccessWorktimeUsage && currentQuery.view !== 'individual'"
      :v-tooltip.top="$t('pages.worktimeUsage.downloadReportTooltip')"
      icon="pi pi-arrow-circle-down"
      severity="secondary"
      type="button"
      @click="handleDownload"
    />
    <DatePicker
      ref="datePicker"
      v-model="dateRange"
      class="flex-1 min-w-56"
      selection-mode="range"
      :manual-input="false"
      :date-format="dateFormat"
      show-button-bar
      :number-of-months="2"
      :show-other-months="false"
      @update:model-value="handleDateChange"
    />
    <Select
      v-model="selectedPerspective"
      :options="perspectiveOptions"
      option-label="name"
      :placeholder="$t('pages.worktimeUsage.selectPerspective')"
      class="w-18"
      @change="handlePerspectiveChange"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center gap-2">
          <i :class="slotProps.value.icon"></i>
          <span>{{ slotProps.value.name }}</span>
        </div>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-2">
          <i :class="slotProps.option.icon"></i>
          <span>{{ slotProps.option.name }}</span>
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';

import { useAuthorization } from '@/composables/useAuthorization';
import { useDateFormat } from '@/composables/useDateFormat';

import { useWorktimeQuery } from '../../_composables';

interface IEmits {
  (e: 'download'): void;
}

const emit = defineEmits<IEmits>();
const { t } = useI18n();

const { currentQuery, updateDateRange, updatePerspective } = useWorktimeQuery();
const { canAccessWorktimeUsage } = useAuthorization();
const { dateFormat } = useDateFormat();

enum EPerspective {
  TIME = '0',
  COST = '1',
  RATE = '2',
  IN_SHIFT = '3',
}

const perspectiveOptions = [
  { name: t('pages.worktimeUsage.perspectives.time'), value: EPerspective.TIME, icon: 'pi pi-clock' },
  { name: t('pages.worktimeUsage.perspectives.cost'), value: EPerspective.COST, icon: 'pi pi-dollar' },
  { name: t('pages.worktimeUsage.perspectives.rate'), value: EPerspective.RATE, icon: 'pi pi-percentage' },
  { name: t('pages.worktimeUsage.perspectives.inShift'), value: EPerspective.IN_SHIFT, icon: 'pi pi-wrench' },
];

const datePicker = ref();
const dateRange = ref<Date[]>([]);
const selectedPerspective = ref(
  perspectiveOptions.find((opt) => opt.value === currentQuery.value.perspective) || perspectiveOptions[0]
);

const handleDateChange = (value: Date | Date[] | (Date | null)[] | null | undefined): void => {
  if (value && Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
    const startLocal = value[0] as Date;
    const endLocal = value[1] as Date;

    const startUtc = new Date(
      Date.UTC(startLocal.getFullYear(), startLocal.getMonth(), startLocal.getDate()),
    );
    const endUtc = new Date(
      Date.UTC(endLocal.getFullYear(), endLocal.getMonth(), endLocal.getDate() + 1),
    );

    updateDateRange(startUtc.toISOString(), endUtc.toISOString());

    if (datePicker.value) {
      datePicker.value.overlayVisible = false;
    }
  }
};

const handlePerspectiveChange = () => {
  updatePerspective(selectedPerspective.value.value);
};

const handleDownload = () => {
  emit('download');
};

const isoWindowToDateRange = (startIso: string, endIso: string): Date[] => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const inclusiveEnd = new Date(end.getTime() - 24 * 60 * 60 * 1000);
  return [start, inclusiveEnd];
};

watch(
  () => [currentQuery.value.startDate, currentQuery.value.endDate],
  ([newStart, newEnd]) => {
    dateRange.value = isoWindowToDateRange(newStart, newEnd);
  },
);

onMounted(() => {
  dateRange.value = isoWindowToDateRange(
    currentQuery.value.startDate,
    currentQuery.value.endDate,
  );
});
</script>
