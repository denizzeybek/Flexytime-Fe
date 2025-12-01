<template>
  <div>
    <!-- Toggle All Button -->
    <div class="w-full flex justify-end mb-4">
      <Button
        :label="isAllExpanded ? t('pages.timesheets.timeManagement.collapseAll') : t('pages.timesheets.timeManagement.expandAll')"
        severity="secondary"
        outlined
        @click="toggleAllRows"
      />
    </div>

    <!-- Empty State -->
    <NoDataState v-if="!tableData.length" :message="t('pages.timesheets.timeManagement.noData')" />

    <!-- TreeTable -->
    <TreeTable
      v-else
      v-model:expandedKeys="expandedKeys"
      :value="tableData"
      tableStyle="min-width: 50rem"
      class="time-management-table"
    >
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :expander="col.expander"
        :style="col.field === 'title' ? 'width: 30%' : 'width: 10%'"
      >
        <template #header>
          <div class="flex flex-col gap-1 justify-center items-center text-center">
            <span class="text-gray-400 text-xs">{{ col.header.title }}</span>
            <span class="font-medium text-gray-700 text-sm">{{ col.header.subTitle }}</span>
          </div>
        </template>
        <template #body="{ node }">
          <span
            :class="[
              col.field === 'title' ? 'font-semibold' : 'text-gray-600',
              node.children?.length ? 'text-gray-800' : 'text-gray-500',
            ]"
          >
            {{ node.data[col.field] }}
          </span>
        </template>
      </Column>
    </TreeTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import NoDataState from '@/components/common/NoDataState.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeManagementsStore } from '@/stores/timeSheets/timeManagement';

import type { TimeEntryWeekViewModel } from '@/client';

interface ITreeNode {
  key: string;
  data: Record<string, string>;
  children?: ITreeNode[];
}

const { t } = useI18n<{ message: MessageSchema }>();

const timeManagementsStore = useTimesheetsTimeManagementsStore();
const expandedKeys = ref<Record<string, boolean>>({});
const isAllExpanded = ref(false);

const DAY_KEYS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'] as const;

const columns = computed(() => {
  const headers = timeManagementsStore.dayHeaders;

  return [
    {
      field: 'title',
      header: { title: '', subTitle: '' },
      expander: true,
    },
    ...DAY_KEYS.map((key, index) => ({
      field: key,
      header: {
        title: headers[index]?.title ?? '',
        subTitle: headers[index]?.subTitle ?? '',
      },
      expander: false,
    })),
  ];
});

const tableData = computed<ITreeNode[]>(() => {
  const entries = timeManagementsStore.weekEntries;

  if (!entries?.length) return [];

  return entries.map((parent: TimeEntryWeekViewModel, idx: number) => ({
    key: idx.toString(),
    data: {
      title: parent.Name ?? '',
      ...DAY_KEYS.reduce(
        (acc, key, index) => {
          acc[key] = parent.Days?.[index] ?? '-';
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    children: parent.Children?.map((child, childIdx) => ({
      key: `${idx}-${childIdx}`,
      data: {
        title: child.Name ?? '',
        ...DAY_KEYS.reduce(
          (acc, key, index) => {
            acc[key] = child.Days?.[index] ?? '-';
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    })),
  }));
});

const toggleAllRows = () => {
  const newKeys: Record<string, boolean> = {};

  if (!isAllExpanded.value) {
    tableData.value.forEach((_, idx) => {
      newKeys[idx.toString()] = true;
    });
  }

  expandedKeys.value = newKeys;
  isAllExpanded.value = !isAllExpanded.value;
};
</script>

<style scoped>
.time-management-table :deep(.p-treetable-thead > tr > th) {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.time-management-table :deep(.p-treetable-tbody > tr) {
  transition: background-color 0.2s;
}

.time-management-table :deep(.p-treetable-tbody > tr:hover) {
  background: #f1f5f9;
}

.time-management-table :deep(.p-treetable-tbody > tr > td) {
  padding: 1rem;
  text-align: center;
}

.time-management-table :deep(.p-treetable-tbody > tr > td:first-child) {
  text-align: left;
}
</style>
