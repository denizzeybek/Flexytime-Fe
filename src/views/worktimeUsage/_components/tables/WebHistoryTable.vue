<template>
  <DataTable
    :value="isLoading ? skeletonData : webClocks"
    striped-rows
    paginator
    :rows="20"
    :rows-per-page-options="[10, 20, 50, 100]"
    table-style="min-width: 50rem"
  >
    <Column field="Date" header="Date" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else>{{ slotProps.data.Date }}</span>
      </template>
    </Column>

    <Column field="Url" header="URL" sortable>
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

    <Column field="TopicName" header="Category" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="5rem" />
        <Tag v-else :value="slotProps.data.TopicName" />
      </template>
    </Column>

    <Column field="Spent" header="Time" sortable>
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" />
        <span v-else class="font-semibold">{{ slotProps.data.Spent }}</span>
      </template>
    </Column>

    <Column header="Actions">
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
            v-tooltip.top="'Mark as Work'"
            @click="handleToggleDomain(slotProps.data, 4)"
          />
          <Button
            v-if="slotProps.data.Domain !== 3"
            icon="pi pi-crown"
            size="small"
            severity="warn"
            v-tooltip.top="'Mark as Meeting'"
            @click="handleToggleDomain(slotProps.data, 3)"
          />
          <Button
            v-if="slotProps.data.Domain !== 2"
            icon="pi pi-calendar-clock"
            size="small"
            severity="danger"
            v-tooltip.top="'Mark as Leisure'"
            @click="handleToggleDomain(slotProps.data, 2)"
          />
          <Button
            v-if="slotProps.data.Domain !== 1"
            icon="pi pi-question"
            size="small"
            severity="secondary"
            v-tooltip.top="'Mark as Unclassified'"
            @click="handleToggleDomain(slotProps.data, 1)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
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
