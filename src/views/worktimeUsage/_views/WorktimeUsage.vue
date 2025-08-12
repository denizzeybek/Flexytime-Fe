<template>
  <div id="messages-area" class="flex flex-col gap-3 mb-4">
    <Message severity="warn" icon="pi pi-exclamation-triangle">Info Message</Message>
  </div>
  <section>
    <div class="flex gap-4 h-full w-full">
      <UserBadge />
      <Summary />
    </div>
  </section>
  <WorktimeButtonGroups />
  <router-view />
</template>

<script setup lang="ts">
import UserBadge from '@/views/worktimeUsage/_components/UserBadge.vue';
import Summary from '@/views/worktimeUsage/_components/summary/Index.vue';
import WorktimeButtonGroups from '@/views/worktimeUsage/_components/WorktimeButtonGroups.vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { ref, provide, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';

const router = useRouter();
const sectionsStore = useSectionsStore();

const payload = ref({
  interval: '',
  perspective: 0,
  teamId: null,
});

const fetchSection = async () => {
  try {
    console.log('hrere');
    await sectionsStore.filter(payload.value);
  } catch (error) {}
};

const fetchIndividual = async () => {
  try {
    await sectionsStore.filterEmployee(payload.value);
  } catch (error) {}
};

const handlePerspective = (event: any) => {
  payload.value = event;
  payload.value.interval = ''; // TODO: remove here when interval format changed
  let isIndividual = false;
  if (event.isIndividual) {
    isIndividual = true;
  }
  if (!isIndividual) {
    // Query'yi güncelle
    console.log('team');
    const query = {
      perspective: event.perspective, // string varsayımı
      interval: event.interval, // örneğin "2024-01-01"
      teamId: event.teamId ?? '', // örneğin "2024-01-31"
    };

    // Boş değerleri filtrele (opsiyonel)
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v != null && v !== ''),
    );

    // router.push({ query: filteredQuery });
    console.log('query ', query);
    router.push({ query });
    fetchSection();
  } else {
    console.log('individual');

    // Query'yi güncelle
    const query = {
      perspective: event.perspective, // string varsayımı
      interval: event.interval, // örneğin "2024-01-01"
      memberId: event.memberId ?? '', // örneğin "2024-01-31"
    };

    // Boş değerleri filtrele (opsiyonel)
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v != null && v !== ''),
    );

    // router.push({ query: filteredQuery });
    console.log('query ', query);
    router.push({
      name: ERouteNames.WorktimeUsageDistributionEmployee,
      query,
    });
    fetchIndividual();
  }
};

provide('handlePerspective', handlePerspective);

// onMounted(() => {
//   handlePerspective(payload.value);
// })
</script>
