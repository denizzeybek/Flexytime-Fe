<template>
  <div class="web-history-tab flex flex-col gap-4">
    <!-- Loading State -->
    <Card v-if="isLoading">
      <template #content>
        <WebHistoryTable :web-clocks="[]" :is-loading="true" />
      </template>
    </Card>

    <!-- Empty / Data State -->
    <template v-else>
      <Card v-for="group in props.webClocks" :key="group.ID">
        <template #header>
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-2">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-full"
                :class="getBadgeClass(group.Type ?? 0)"
              >
                <i :class="getIconClass(group.Type ?? 0)" class="text-white"></i>
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
          <!-- Has Data -->
          <WebHistoryTable
            v-if="group.WebClocks && group.WebClocks.length > 0"
            :web-clocks="group.WebClocks"
            :is-loading="false"
            @toggle-domain="handleToggleDomain"
          />
          <!-- No Data -->
          <NoDataState v-else :message="$t('components.webHistory.noDataAvailable')" />
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

import NoDataState from '@/components/common/NoDataState.vue';

import WebHistoryTable from '../tables/WebHistoryTable.vue';

import type { IWebClock, IWebClocks } from '../../_types';

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
