<template>
  <div id="messages-area" class="flex flex-col gap-3 mb-4">
    <Message severity="warn" icon="pi pi-exclamation-triangle">Info Message</Message>
  </div>
  
  <section>
    <div class="flex gap-4 h-full w-full">
      <UserCard />
      <SummarySection />
    </div>
  </section>
  
  <NavigationButtons />
  
  <Suspense>
    <template #default>
      <router-view :key="$route.fullPath" />
    </template>
    <template #fallback>
      <div class="flex justify-center items-center p-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { provide, onMounted, watch, nextTick } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import UserCard from '../_components/shared/UserCard.vue';
import SummarySection from '../_components/summary/SummarySection.vue';
import NavigationButtons from '../_components/shared/NavigationButtons.vue';
import { useWorktimeNavigation } from '../_composables/useWorktimeNavigation';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useRoute } from 'vue-router';
import type { FilterPayload, WorktimeUsageProps } from '../_types';

const props = withDefaults(defineProps<WorktimeUsageProps>(), {
  viewMode: 'team',
});

const route = useRoute();
const sectionsStore = useSectionsStore();
const { handlePerspectiveChange } = useWorktimeNavigation();

const handleFilterChange = (payload: FilterPayload) => {
  if (!payload || !sectionsStore) return;
  
  const fetchTeamData = async () => {
    try {
      await sectionsStore.filter(payload);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const fetchIndividualData = async () => {
    try {
      await sectionsStore.filterEmployee(payload);
    } catch (error) {
      console.error('Error fetching individual data:', error);
    }
  };

  handlePerspectiveChange(payload, fetchTeamData, fetchIndividualData);
};

// Provide the filter change handler to child components
provide('handleFilterChange', handleFilterChange);
provide('viewMode', props.viewMode);

// Watch for route changes to ensure proper component initialization
watch(
  () => route.fullPath,
  async (newPath, oldPath) => {
    if (newPath !== oldPath && newPath.includes('/clock/')) {
      // Give components time to initialize
      await nextTick();
    }
  },
  { immediate: true }
);
</script>