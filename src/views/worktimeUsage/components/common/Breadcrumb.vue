<template>
  <div class="bg-f-white px-5 py-2 rounded-xl flex justify-center w-full lg:w-fit">
    <Skeleton v-if="isLoading" height="1rem" width="20rem" />

    <PBreadcrumb v-else-if="items.length > 0" :home="home" :model="breadcrumbItems">
      <template #item="{ item, props }">
        <a
          v-if="item.route"
          :href="item.route"
          v-bind="props.action"
          @click.prevent="handleNavigate(item)"
        >
          <span v-if="item.icon" :class="[item.icon, 'text-color']" />
          <span class="text-primary font-semibold">{{ item.label }}</span>
        </a>
        <span v-else class="text-surface-700 dark:text-surface-0">
          {{ item.label }}
        </span>
      </template>
    </PBreadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PBreadcrumb from 'primevue/breadcrumb';
import Skeleton from 'primevue/skeleton';
import { useWorktimeNavigation } from '../../composables';
import type { IBreadcrumb } from '../../types';

interface IProps {
  items?: IBreadcrumb[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  items: () => [],
  isLoading: false,
});

const { handleTeamClick } = useWorktimeNavigation();

const home = {
  icon: 'pi pi-home',
};

const breadcrumbItems = computed(() => {
  return props.items.map((b) => ({
    id: b.id,
    label: b.title,
    route: b.path,
  }));
});

function handleNavigate(item: any) {
  if (item.id) {
    handleTeamClick(item.id);
  }
}
</script>
