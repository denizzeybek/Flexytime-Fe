<template>
  <div class="flex gap-2.5 items-center w-full lg:w-fit">
    <Button
      v-if="canAccessWorktimeUsage"
      :v-tooltip.top="$t('pages.worktimeUsage.downloadReportTooltip')"
      icon="pi pi-arrow-circle-down"
      severity="secondary"
      type="button"
      @click="handleDownload"
    />
    <DatePicker
      v-model="dateRange"
      class="flex-1 min-w-56"
      selection-mode="range"
      :manual-input="false"
      :date-format="dateFormat"
      show-button-bar
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
import { onMounted, ref } from 'vue';
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

const { currentQuery, updateInterval, updatePerspective } = useWorktimeQuery();
const { canAccessWorktimeUsage } = useAuthorization();
const { dateFormat } = useDateFormat();

enum EPerspective {
  TIME = 0,
  COST = 1,
  RATE = 2,
  IN_SHIFT = 3,
}

const perspectiveOptions = [
  { name: t('pages.worktimeUsage.perspectives.time'), value: EPerspective.TIME, icon: 'pi pi-clock' },
  { name: t('pages.worktimeUsage.perspectives.cost'), value: EPerspective.COST, icon: 'pi pi-dollar' },
  { name: t('pages.worktimeUsage.perspectives.rate'), value: EPerspective.RATE, icon: 'pi pi-percentage' },
  { name: t('pages.worktimeUsage.perspectives.inShift'), value: EPerspective.IN_SHIFT, icon: 'pi pi-wrench' },
];

const dateRange = ref<Date[]>([]);
const selectedPerspective = ref(perspectiveOptions[0]);

const handleDateChange = (value: Date | Date[] | (Date | null)[] | null | undefined): void => {
  if (value && Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
    const startDate = value[0] as Date;
    const endDate = value[1] as Date;

    // Calculate difference in days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include end date

    // Format: DD.MM.YYYY-{days} using startDate
    const day = String(startDate.getDate()).padStart(2, '0');
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const year = startDate.getFullYear();

    const interval = `${day}.${month}.${year}-${diffDays}`;
    updateInterval(interval);
  }
};

const handlePerspectiveChange = () => {
  updatePerspective(selectedPerspective.value.value);
};

const handleDownload = () => {
  emit('download');
};

// Initialize from query
onMounted(() => {
  // Parse interval from query (format: DD.MM.YYYY-{days} where date is startDate)
  if (currentQuery.value.interval) {
    const [dateStr, daysStr] = currentQuery.value.interval.split('-');
    const days = parseInt(daysStr, 10);

    // Parse DD.MM.YYYY as startDate
    const [day, month, year] = dateStr.split('.').map(Number);
    const startDate = new Date(year, month - 1, day);

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (days - 1)); // -1 because days includes start date

    dateRange.value = [startDate, endDate];
  }

  // Set perspective from query
  const perspectiveFromQuery = perspectiveOptions.find(
    (opt) => opt.value === currentQuery.value.perspective
  );
  if (perspectiveFromQuery) {
    selectedPerspective.value = perspectiveFromQuery;
  }
});
</script>
