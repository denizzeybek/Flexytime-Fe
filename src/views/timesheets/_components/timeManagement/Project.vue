<template>
  <Card>
    <template #content>
      <div class="w-full flex justify-end">
        <Button :label="t('pages.timesheets.project.toggleAll')" @click="toggleApplications" />
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeManagementsStore } from '@/stores/timeSheets/timeManagement';

import { useTimeManagement } from '../../_composables/useTimeManagement';

const { t } = useI18n<{ message: MessageSchema }>();

const timeManagementsStore = useTimesheetsTimeManagementsStore();
const { generateDateRange, generateTableColumns, generateTableData } = useTimeManagement();
const expandedKeys = ref({});
const isOpen = ref(false);

const projectData = computed(() => {
  return generateTableData(timeManagementsStore.projectList);
});
const tableHeaders = computed(() => {
  const dateRage = timeManagementsStore.dateRange;
  return generateDateRange(dateRage[0], dateRage[1]);
});

const columns = computed(() => {
  return generateTableColumns(tableHeaders.value);
});

const toggleApplications = () => {
  const _expandedKeys = { ...expandedKeys.value };
  if (!isOpen.value) {
    projectData.value.forEach((_, idx) => {
      _expandedKeys[idx] = true;
    });
  } else {
    projectData.value.forEach((_, idx) => {
      delete _expandedKeys[idx];
    });
  }
  isOpen.value = !isOpen.value;
  expandedKeys.value = _expandedKeys;
};
</script>

<style scoped></style>
