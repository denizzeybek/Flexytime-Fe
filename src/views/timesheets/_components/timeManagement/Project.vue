<template>
  <Card>
    <template #content>
      <div class="w-full flex justify-end">
        <Button @click="toggleApplications" label="Toggle All" />
      </div>
      <TreeTable
        v-model:expandedKeys="expandedKeys"
        :value="projectData"
        tableStyle="min-width: 50rem"
      >
        <Column v-for="col of columns" :key="col.field" :field="col.field" :expander="col.expander">
          <template #header>
            <div class="flex flex-col gap-3 justify-center items-center">
              <div>{{ col.header.title }}</div>
              <div class="font-medium">{{ col.header.subTitle }}</div>
            </div>
          </template>
        </Column>
      </TreeTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useTimesheetsTimeManagementsStore } from '@/stores/timeSheets/timeManagement';
import { computed, ref, watch } from 'vue';
import { useTimeManagement } from '../../_composables/useTimeManagement';

const timeManagementsStore = useTimesheetsTimeManagementsStore();
const { generateDateRange, generateTableColumns, generateTableData } = useTimeManagement();
const expandedKeys = ref({});
const isOpen = ref(false);

const projectData = computed(() => {
  const dateRage = timeManagementsStore.dateRange;
  return generateTableData(timeManagementsStore.projectList, dateRage[0], dateRage[1]);
});
const tableHeaders = computed(() => {
  const dateRage = timeManagementsStore.dateRange;
  return generateDateRange(dateRage[0], dateRage[1]);
});

const columns = computed(() => {
  const dateRage = timeManagementsStore.dateRange;
  return generateTableColumns(tableHeaders.value, dateRage[0], dateRage[1]);
});

const toggleApplications = () => {
  let _expandedKeys = { ...expandedKeys.value };
  if (!isOpen.value) {
    projectData.value.forEach((element, idx) => {
      _expandedKeys[idx] = true;
    });
  } else {
    projectData.value.forEach((element, idx) => {
      delete _expandedKeys[idx];
    });
  }
  isOpen.value = !isOpen.value;
  expandedKeys.value = _expandedKeys;
};
</script>

<style scoped></style>
