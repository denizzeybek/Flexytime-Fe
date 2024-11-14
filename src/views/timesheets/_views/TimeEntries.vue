<template>
  <div class="flex justify-center">
    <Tabs :value="route.meta.name?.toString()!">
      <TabList>
        <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method()">
          <span>{{ tab.label }}</span>
        </Tab>
      </TabList>
    </Tabs>
  </div>

  <TabPanels class="mt-12">
    <TabPanel :key="route.path" :value="route.path">
      <router-view :key="route.path" />
    </TabPanel>
  </TabPanels>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRoute, useRouter } from 'vue-router';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

const route = useRoute();
const router = useRouter();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const items = ref([
  {
    route: ERouteNames.TimeEntriesManual,
    label: ERouteNames.TimeEntriesManual,
    method: () => {
      router.push({ name: ERouteNames.TimeEntriesManual });
    },
  },
  {
    route: ERouteNames.TimeEntriesUnclassified,
    label: ERouteNames.TimeEntriesUnclassified,
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
