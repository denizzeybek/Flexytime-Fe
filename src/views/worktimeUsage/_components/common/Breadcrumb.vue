<template>
  <div class="bg-surface-primary dark:bg-surface-secondary py-2 rounded-xl flex justify-center w-full lg:w-fit transition-colors">
    <Skeleton v-if="isLoading" height="1.5rem" width="20rem" />

    <PBreadcrumb v-else-if="items.length > 0" :model="breadcrumbItems">
      <template #item="{ item }">
        <span
          v-if="item.isLast"
          class="text-surface-700 dark:text-surface-0 font-semibold inline-flex items-center"
        >
          <i v-if="item.type === 'home'" class="pi pi-home" :title="item.label" />
          <span v-else>{{ item.label }}</span>
        </span>
        <a
          v-else
          href="#"
          class="cursor-pointer inline-flex items-center"
          @click.prevent="handleNavigate(item)"
        >
          <i v-if="item.type === 'home'" class="pi pi-home text-primary hover:underline" :title="item.label" />
          <span v-else class="text-primary font-semibold hover:underline">{{ item.label }}</span>
        </a>
      </template>
    </PBreadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import PBreadcrumb from 'primevue/breadcrumb';
import Skeleton from 'primevue/skeleton';

import { useWorktimeNavigation } from '../../_composables';

import type { IBreadcrumb } from '../../_types';

interface IProps {
  items?: IBreadcrumb[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  items: () => [],
  isLoading: false,
});

const { handleTeamClick } = useWorktimeNavigation();

interface BreadcrumbModelItem {
  type: 'home' | 'team' | 'employee';
  label: string;
  teamId: string | null;
  isLast: boolean;
}

const breadcrumbItems = computed<BreadcrumbModelItem[]>(() => {
  return props.items.map((b) => ({
    type: b.Type,
    label: b.Label,
    teamId: b.TeamId,
    isLast: b.IsLast,
  }));
});

const handleNavigate = (item: BreadcrumbModelItem) => {
  if (item.type === 'home') {
    handleTeamClick('__company__');
    return;
  }
  if (item.type === 'team' && item.teamId) {
    handleTeamClick(item.teamId);
  }
};
</script>
