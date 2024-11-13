<template>
  <div class="flex flex-col gap-6">
    <Tabs v-model:value="activeTab">
      <div class="!flex !justify-center">
        <TabList>
          <Tab value="0">Time Entries</Tab>
          <Tab value="1">Unclassified Time Entries</Tab>
        </TabList>
      </div>
      <TabPanels class="mt-12">
        <TabPanel value="0">
          <div class="flex flex-col gap-12">
            <EnterTime />
            <ManualTimeEntries />
          </div>
        </TabPanel>
        <TabPanel value="1">
          <UnclassifiedTimeEntries />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { ref, watch } from 'vue';
import EnterTime from '../_components/timeEntries/EnterTime.vue';
import ManualTimeEntries from '../_components/timeEntries/ManualTimeEntries.vue';
import UnclassifiedTimeEntries from '../_components/timeEntries/UnclassifiedTimeEntries.vue';

const timeEntriesStore = useTimesheetsTimeEntriesStore();

const activeTab = ref('0');

watch(
  activeTab,
  async (value) => {
    if (value === '0') {
      await timeEntriesStore.fetchManualTimeEntries();
    } else {
      await timeEntriesStore.fetchUnclassifiedTimeEntries();
    }
  },
  { immediate: true },
);
</script>

<style scoped></style>
