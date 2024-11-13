<template>
  <div class="flex flex-col gap-6">
    <EnterTime />
    <Tabs v-model:value="activeTab">
      <div class="!flex !justify-center">
        <TabList>
          <Tab value="0">Manual Time Entries</Tab>
          <Tab value="1">Automatic Time Entries</Tab>
        </TabList>
      </div>
      <TabPanels>
        <TabPanel value="0">
          <ManualTimeEntries />
        </TabPanel>
        <TabPanel value="1">
          <AutomaticTimeEntries />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import EnterTime from '../_components/timeEntries/EnterTime.vue';
import { ref, onMounted } from 'vue';
import ManualTimeEntries from '../_components/timeEntries/ManualTimeEntries.vue';
import AutomaticTimeEntries from '../_components/timeEntries/AutomaticTimeEntries.vue';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

const timeEntriesStore = useTimesheetsTimeEntriesStore();

const activeTab = ref('0');

onMounted(async () => {
  await timeEntriesStore.filterManualTimeEntries();
});
</script>

<style scoped></style>
