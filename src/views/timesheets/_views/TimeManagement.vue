<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors">
    <template #content>
      <div class="flex w-full justify-between items-center flex-col lg:flex-row gap-5 mb-6 pb-5">
        <!-- Perspective Switch (Person / Project) -->
        <Tabs :value="timeManagementsStore.perspective">
          <TabList>
            <Tab
              v-for="tab in perspectiveTabs"
              :key="tab.key"
              :value="tab.key"
              @click="onPerspectiveChanged(tab.key)"
            >
              <span class="font-medium">{{ t(tab.labelKey) }}</span>
            </Tab>
          </TabList>
        </Tabs>

        <!-- Date Navigation -->
        <div class="flex items-center gap-2">
          <Button
            severity="secondary"
            outlined
            class="!w-11 !h-11 !min-w-11 !p-0 flex items-center justify-center"
            @click="timeManagementsStore.goToPreviousWeek()"
          >
            <i class="pi pi-chevron-left" />
          </Button>

          <FDateTimePicker
            id="time-management-date"
            class="min-w-[15rem]"
            name="date"
            :placeholder="t('pages.timesheets.timeManagement.datePlaceholder')"
            :prime-props="{
              showTime: false,
              hourFormat: '24',
              fluid: true,
              size: 'large',
              selectionMode: 'range',
              maxDate: maxDate,
            }"
          />

          <Button
            severity="secondary"
            outlined
            class="!w-11 !h-11 !min-w-11 !p-0 flex items-center justify-center"
            :disabled="isNextWeekDisabled"
            @click="timeManagementsStore.goToNextWeek()"
          >
            <i class="pi pi-chevron-right" />
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="timeManagementsStore.isLoading" class="flex justify-center items-center py-10">
        <i class="pi pi-spin pi-spinner text-4xl text-f-primary" />
      </div>

      <!-- Content -->
      <div v-else class="mt-1">
        <TimeManagementTable />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import Card from 'primevue/card';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import { useForm } from 'vee-validate';
import { array, object, string } from 'yup';

import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeManagementsStore } from '@/stores/timeSheets/timeManagement';

import TimeManagementTable from '../_components/timeManagement/TimeManagementTable.vue';

const { t } = useI18n<{ message: MessageSchema }>();

const timeManagementsStore = useTimesheetsTimeManagementsStore();

const validationSchema = object({
  date: array().label(t('common.validation.fields.date')).of(string()),
});

const { resetForm, defineField } = useForm({
  validationSchema,
});

const [date] = defineField('date');

const maxDate = computed(() => new Date());

const isNextWeekDisabled = computed(() => {
  const nextWeekStart = dayjs(timeManagementsStore.startDate).add(7, 'day');
  return nextWeekStart.isAfter(dayjs(), 'day');
});

const perspectiveTabs = [
  {
    key: 'employee' as const,
    icon: 'pi pi-user',
    labelKey: 'pages.timesheets.timeManagement.tabs.person',
  },
  {
    key: 'project' as const,
    icon: 'pi pi-folder',
    labelKey: 'pages.timesheets.timeManagement.tabs.project',
  },
];

const onPerspectiveChanged = (key: 'employee' | 'project') => {
  timeManagementsStore.setPerspective(key);
};

watch(
  () => date.value,
  (dates) => {
    if (dates && dates.length > 0) {
      timeManagementsStore.setDateRange(dates as Date[]);
    }
  },
);

onMounted(() => {
  // Set initial date range from store
  resetForm({
    values: {
      date: timeManagementsStore.dateRange,
    },
  });

  // Fetch initial data
  timeManagementsStore.fetchWeekEntries();
});
</script>

<style></style>
