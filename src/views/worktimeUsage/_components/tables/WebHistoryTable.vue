<template>
  <DataTable
    :value="isLoading ? skeletonData : webClocks"
    striped-rows
    paginator
    :rows="20"
    :rows-per-page-options="[10, 20, 50, 100]"
    table-style="min-width: 50rem"
  >
    <Column field="Date" :header="$t('components.webHistoryTable.columns.date')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.Date }}</span>
      </template>
    </Column>

    <Column field="Url" :header="$t('components.webHistoryTable.columns.url')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <a
          v-else
          :href="slotProps.data.Url"
          target="_blank"
          class="text-blue-600 hover:underline truncate max-w-md block"
          :title="slotProps.data.Url"
        >
          {{ slotProps.data.Url }}
        </a>
      </template>
    </Column>

    <Column field="TopicName" :header="$t('components.webHistoryTable.columns.category')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="5rem" />
        <Tag v-else :value="slotProps.data.TopicName" />
      </template>
    </Column>

    <Column field="Spent" :header="$t('components.webHistoryTable.columns.time')" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else class="font-semibold">{{ slotProps.data.Spent }}</span>
      </template>
    </Column>

    <Column :header="$t('components.webHistoryTable.columns.actions')">
      <template #body="slotProps">
        <div v-if="isLoading" class="flex gap-2">
          <Skeleton width="2rem" height="2rem" />
          <Skeleton width="2rem" height="2rem" />
          <Skeleton width="2rem" height="2rem" />
        </div>
        <div v-else class="flex gap-2">
          <!-- Show all action buttons except current domain type -->
          <Button
            v-if="slotProps.data.Domain !== 4"
            icon="pi pi-wrench"
            size="small"
            severity="success"
            :v-tooltip.top="$t('components.webHistoryTable.tooltips.markAsWork')"
            @click="handleToggleDomain(slotProps.data, 4)"
          />
          <Button
            v-if="slotProps.data.Domain !== 3"
            icon="pi pi-crown"
            size="small"
            severity="warn"
            :v-tooltip.top="$t('components.webHistoryTable.tooltips.markAsMeeting')"
            @click="handleToggleDomain(slotProps.data, 3)"
          />
          <Button
            v-if="slotProps.data.Domain !== 2"
            icon="pi pi-calendar-clock"
            size="small"
            severity="danger"
            :v-tooltip.top="$t('components.webHistoryTable.tooltips.markAsLeisure')"
            @click="handleToggleDomain(slotProps.data, 2)"
          />
          <Button
            v-if="slotProps.data.Domain !== 1"
            icon="pi pi-question"
            size="small"
            severity="secondary"
            :v-tooltip.top="$t('components.webHistoryTable.tooltips.markAsUnclassified')"
            @click="handleToggleDomain(slotProps.data, 1)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';

import { type MessageSchema } from '@/plugins/i18n';

import type { IWebClock } from '../../_types';

interface IProps {
  webClocks?: IWebClock[];
  isLoading?: boolean;
}

interface IEmits {
  (e: 'toggle-domain', webClock: IWebClock, newDomain: number): void;
}

withDefaults(defineProps<IProps>(), {
  webClocks: () => [],
  isLoading: false,
});

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const handleToggleDomain = (webClock: IWebClock, newDomain: number) => {
  emit('toggle-domain', webClock, newDomain);
};

// Skeleton dummy data - 10 rows for loading state (web history usually has more rows)
const skeletonData = Array.from({ length: 10 }, (_, i) => ({
  ID: `skeleton-${i}`,
  Url: '',
  TopicName: '',
  Spent: '',
  Date: '',
  AllocationName: null,
  RecordDate: '',
  AllocationId: '',
  Domain: 0,
}));
</script>
