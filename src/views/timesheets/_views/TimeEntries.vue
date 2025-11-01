<template>
  <Card class="shadow-lg mb-5 border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <div class="flex justify-center">
        <Tabs :value="route.name?.toString()!">
          <TabList>
            <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method">
              <span class="font-medium">{{ tab.label }}</span>
            </Tab>
          </TabList>
        </Tabs>
      </div>
    </template>
  </Card>

  <div class="mt-1">
    <router-view :key="route.path" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRoute, useRouter } from 'vue-router';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { useI18n } from 'vue-i18n';
import type { MessageSchema } from '@/plugins/i18n';
import Card from 'primevue/card';

const route = useRoute();
const router = useRouter();
const timeEntriesStore = useTimesheetsTimeEntriesStore();
const { t } = useI18n<{ message: MessageSchema }>();

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

watch(
  () => route.meta.name,
  (name) => {
    // TODO: burda payload'ı yollarken startDate ve endDate'i de yollamak gerekebilir. onu da datePicker'dan alman gerekir. şu an datePicker'a göre almıyor
    if (name === ERouteNames.TimeEntriesManual) {
      timeEntriesStore.fetchManualTimeEntries();
    } else if (name === ERouteNames.TimeEntriesUnclassified) {
      timeEntriesStore.fetchUnclassifiedTimeEntries();
    }
  },
  { immediate: true },
);
</script>
