<template>
  <div class="web-history-tab flex flex-col gap-4">
    <template v-if="isLoading || (props.webClocks && props.webClocks.length > 0)">
      <!-- Loop through each allocation group (Work, Leisure, Unclassified, Meeting) -->
      <!-- During loading, show skeleton cards -->
      <template v-if="isLoading">
        <Card v-for="i in 3" :key="`skeleton-${i}`">
          <template #header>
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-2">
                <Skeleton shape="circle" size="2.5rem" />
                <Skeleton height="1.5rem" width="8rem" />
              </div>
              <div class="flex items-center gap-2">
                <Skeleton height="1.5rem" width="6rem" />
              </div>
            </div>
          </template>
          <template #content>
            <WebHistoryTable
              :web-clocks="[]"
              :is-loading="true"
              @toggle-domain="handleToggleDomain"
            />
          </template>
        </Card>
      </template>
      <!-- When loaded, show actual data -->
      <template v-for="group in props.webClocks" v-else :key="group.ID">
        <Card v-if="group.WebClocks && group.WebClocks.length > 0">
          <template #header>
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-2">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full"
                  :class="getBadgeClass(group.Type)"
                >
                  <i :class="getIconClass(group.Type)" class="text-white"></i>
                </div>
                <span class="font-semibold text-lg">{{ group.Name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ $t('components.webHistory.totalTime') }}:</span>
                <span class="font-semibold">{{ group.Spent }}</span>
              </div>
            </div>
          </template>
          <template #content>
            <WebHistoryTable
              :web-clocks="group.WebClocks"
              :is-loading="false"
              @toggle-domain="handleToggleDomain"
            />
          </template>
        </Card>
      </template>
    </template>
    <div v-else-if="!isLoading" class="flex flex-col items-center gap-8 py-8">
      <img src="@/assets/images/noData.svg" alt="No Data" />
      <span class="text-gray-500">{{ $t('components.webHistory.noDataAvailable') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';

import WebHistoryTable from '../tables/WebHistoryTable.vue';

import type { IWebClock,IWebClocks } from '../../_types';


interface IProps {
  webClocks?: IWebClocks[];
  isLoading?: boolean;
}

interface IEmits {
  (e: 'toggle-domain', webClock: IWebClock, newDomain: number): void;
}

const props = withDefaults(defineProps<IProps>(), {
  webClocks: () => [],
  isLoading: false,
});

const emit = defineEmits<IEmits>();

const handleToggleDomain = (webClock: IWebClock, newDomain: number) => {
  emit('toggle-domain', webClock, newDomain);
};

// Badge class helper function based on allocation Type
const getBadgeClass = (type: number): string => {
  const mapping: Record<number, string> = {
    4: 'bg-green-500',   // Work
    3: 'bg-orange-500',  // Meeting
    2: 'bg-red-500',     // Leisure
    1: 'bg-slate-500',   // Unclassified
  };
  return mapping[type] || 'bg-blue-500';
};

// Icon helper function based on allocation Type (matching WebHistoryTable icons)
const getIconClass = (type: number): string => {
  const mapping: Record<number, string> = {
    4: 'pi pi-wrench',         // Work
    3: 'pi pi-crown',          // Meeting
    2: 'pi pi-calendar-clock', // Leisure
    1: 'pi pi-question',       // Unclassified
  };
  return mapping[type] || 'pi pi-question';
};
</script>
