<template>
  <div class="bg-surface-primary dark:bg-surface-secondary py-2 rounded-xl flex justify-center w-full lg:w-fit transition-colors">
    <Skeleton v-if="isLoading" height="1.5rem" width="20rem" />

    <PBreadcrumb v-else-if="items.length > 0" :model="breadcrumbItems">
      <template #item="{ item }">
        <span
          v-if="item.isLast"
          class="text-surface-700 dark:text-surface-0 font-semibold inline-flex items-center"
        >
          <i v-if="item.type === 'home'" class="pi pi-home" :title="String(item.label ?? '')" />
          <span v-else>{{ item.label }}</span>
        </span>
        <a
          v-else
          href="#"
          class="cursor-pointer inline-flex items-center"
          @click.prevent="navigate(item)"
        >
          <i v-if="item.type === 'home'" class="pi pi-home text-primary hover:underline" :title="String(item.label ?? '')" />
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

const breadcrumbItems = computed(() => {
  return props.items.map((b) => ({
    type: (b.Type ?? 'team') as BreadcrumbModelItem['type'],
    label: b.Label ?? '',
    teamId: b.TeamId ?? null,
    isLast: b.IsLast ?? false,
  }));
});

const handleNavigate = (item: { type: string; teamId?: string | null }) => {
  if (item.type === 'home') {
    handleTeamClick('__company__');
    return;
  }
  if (item.type === 'team' && item.teamId) {
    handleTeamClick(item.teamId);
  }
};

const navigate = (item: Record<string, unknown>) => {
  handleNavigate({
    type: String(item.type ?? ''),
    teamId: (item.teamId as string | null | undefined) ?? null,
  });
};
</script>
