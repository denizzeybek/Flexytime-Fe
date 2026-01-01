<template>
  <Card class="shadow-lg mb-5 border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <div class="flex justify-between items-center">
        <Tabs :value="route.name?.toString()!">
          <TabList>
            <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method">
              <span class="font-medium">{{ tab.label }}</span>
            </Tab>
          </TabList>
        </Tabs>
        <div class="flex items-center gap-3">
          <!-- Hours Filter (only for Unclassified) -->
          <FSelect
            v-if="isUnclassifiedRoute"
            name="selectedHours"
            :options="hoursOptions"
            :placeholder="t('pages.timesheets.timeEntries.hoursFilter.placeholder')"
            class="w-40"
            @selected="onHoursChange"
          />
          <DatePicker
            v-model="selectedDate"
            :maxDate="maxDate"
            dateFormat="dd.mm.yy"
            showIcon
            iconDisplay="input"
            :placeholder="t('pages.timesheets.timeEntries.datePicker.placeholder')"
            class="w-48"
          />
        </div>
      </div>
    </template>
  </Card>

  <div class="mt-1">
    <router-view :key="route.path" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import dayjs from 'dayjs';
import Card from 'primevue/card';
import { useForm } from 'vee-validate';

import { ERouteNames } from '@/router/routeNames.enum';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

import type { MessageSchema } from '@/plugins/i18n';

const route = useRoute();
const router = useRouter();
const timeEntriesStore = useTimesheetsTimeEntriesStore();
const { t } = useI18n<{ message: MessageSchema }>();

// Form for FSelect
const { resetForm } = useForm();

const selectedDate = ref<Date>(new Date());
const selectedHours = ref<number>(24);
const items = ref([
  {
    route: ERouteNames.TimeEntriesManual,
    label: t('pages.timesheets.timeEntries.manual.label'),
    method: () => {
      router.push({ name: ERouteNames.TimeEntriesManual });
    },
  },
  {
    route: ERouteNames.TimeEntriesUnclassified,
    label: t('pages.timesheets.timeEntries.unclassified.label'),
    method: () => {
      router.push({ name: ERouteNames.TimeEntriesUnclassified });
    },
  },
]);

const maxDate = computed(() => new Date());
const isUnclassifiedRoute = computed(() => route.name === ERouteNames.TimeEntriesUnclassified);

const hoursOptions = computed(() => [
  { name: t('pages.timesheets.timeEntries.hoursFilter.hourly'), value: '1', label: t('pages.timesheets.timeEntries.hoursFilter.hourly') },
  { name: t('pages.timesheets.timeEntries.hoursFilter.fourHours'), value: '4', label: t('pages.timesheets.timeEntries.hoursFilter.fourHours') },
  { name: t('pages.timesheets.timeEntries.hoursFilter.eightHours'), value: '8', label: t('pages.timesheets.timeEntries.hoursFilter.eightHours') },
  { name: t('pages.timesheets.timeEntries.hoursFilter.allDay'), value: '24', label: t('pages.timesheets.timeEntries.hoursFilter.allDay') },
]);

const onHoursChange = (option: { name: string; value: string }) => {
  selectedHours.value = Number(option.value);
  fetchData();
};

const fetchData = async () => {
  const recordDate = dayjs(selectedDate.value).format('DD.MM.YYYY');
  timeEntriesStore.setQuery({ RecordDate: recordDate, Hours: selectedHours.value });

  const currentRoute = route.name;

  if (currentRoute === ERouteNames.TimeEntriesManual) {
    await timeEntriesStore.fetchTimeEntries();
  } else if (currentRoute === ERouteNames.TimeEntriesUnclassified) {
    await timeEntriesStore.fetchTimeClocks();
  }
};

watch(
  () => route.name,
  (name) => {
    if (name === ERouteNames.TimeEntriesManual || name === ERouteNames.TimeEntriesUnclassified) {
      // Set default value for hours select
      resetForm({
        values: {
          selectedHours: hoursOptions.value.find((o) => o.value === '24'),
        },
      });
      fetchData();
    }
  },
  { immediate: true },
);

watch(selectedDate, () => {
  fetchData();
});
</script>
