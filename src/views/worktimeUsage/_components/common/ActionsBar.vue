<template>
  <div class="flex gap-2 items-center w-full lg:w-fit">
    <Button
      v-tooltip.top="'Download Report'"
      icon="pi pi-arrow-circle-down"
      severity="secondary"
      type="button"
      outlined
      @click="handleDownload"
    />
    <DatePicker
      v-model="dateRange"
      class="flex-1"
      selection-mode="range"
      :manual-input="false"
      date-format="yy-mm-dd"
      show-button-bar
      @update:model-value="handleDateChange as any"
    />
    <Select
      v-model="selectedPerspective"
      :options="perspectiveOptions"
      option-label="name"
      placeholder="Select perspective"
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
import { ref, watch, onMounted } from 'vue';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import { useWorktimeQuery } from '../../_composables';

interface IEmits {
  (e: 'download'): void;
}

const emit = defineEmits<IEmits>();

const { currentQuery, updateInterval, updatePerspective } = useWorktimeQuery();

enum EPerspective {
  TIME = 0,
  COST = 1,
  RATE = 2,
  IN_SHIFT = 3,
}

const perspectiveOptions = [
  { name: 'Time', value: EPerspective.TIME, icon: 'pi pi-clock' },
  { name: 'Cost', value: EPerspective.COST, icon: 'pi pi-dollar' },
  { name: 'Rate', value: EPerspective.RATE, icon: 'pi pi-percentage' },
  { name: 'In Shift', value: EPerspective.IN_SHIFT, icon: 'pi pi-wrench' },
];

const dateRange = ref<Date[]>([]);
const selectedPerspective = ref(perspectiveOptions[0]);

// Initialize from query
onMounted(() => {
  // Parse interval from query (format: YYYY-MM-DD_YYYY-MM-DD)
  if (currentQuery.value.interval) {
    const [start, end] = currentQuery.value.interval.split('_');
    dateRange.value = [new Date(start), new Date(end)];
  }

  // Set perspective from query
  const perspectiveFromQuery = perspectiveOptions.find(
    (opt) => opt.value === currentQuery.value.perspective
  );
  if (perspectiveFromQuery) {
    selectedPerspective.value = perspectiveFromQuery;
  }
});

const handleDateChange = (value: Date[] | null) => {
  if (value && value.length === 2 && value[0] && value[1]) {
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const interval = `${formatDate(value[0])}_${formatDate(value[1])}`;
    updateInterval(interval);
  }
};

const handlePerspectiveChange = () => {
  updatePerspective(selectedPerspective.value.value);
};

const handleDownload = () => {
  emit('download');
};
</script>
