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
        <div class="flex-1 flex justify-end">
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

import { ERouteNames } from '@/router/routeNames.enum';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

import type { MessageSchema } from '@/plugins/i18n';

const route = useRoute();
const router = useRouter();
const timeEntriesStore = useTimesheetsTimeEntriesStore();
const { t } = useI18n<{ message: MessageSchema }>();

const selectedDate = ref<Date>(new Date());
const maxDate = computed(() => new Date());

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

const fetchData = async () => {
  const recordDate = dayjs(selectedDate.value).format('DD.MM.YYYY');
  timeEntriesStore.setQuery({ RecordDate: recordDate });

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
      fetchData();
    }
  },
  { immediate: true },
);

watch(selectedDate, () => {
  fetchData();
});
</script>
