<template>
  <div class="bg-f-white px-5 py-2 rounded-xl flex justify-center w-full lg:w-fit">
    <Breadcrumb :home="home" :model="breadcrumbItems">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useWorktimeNavigation } from '../../_composables/useWorktimeNavigation';

const sectionsStore = useSectionsStore();
const { isTeamView } = useWorktimeNavigation();
const viewMode = inject('viewMode', 'team') as string;

const home = ref({
  icon: 'pi pi-home',
  route: isTeamView.value ? '/clock/section/productivity-team' : '/clock/employee/distribution',
});

const breadcrumbItems = computed(() => {
  if (viewMode === 'individual') {
    return [];
  }
  
  return (sectionsStore.Breadcrumb || [])
    .filter(b => b && b.id && b.title) // Null/undefined items'ları filtrele
    .map((b) => {
      const baseRoute = isTeamView.value ? '/clock/section/productivity-team' : '/clock/employee/distribution';
      return {
        id: b.id,
        label: b.title,
        route: `${baseRoute}?teamId=${b.id}`,
      };
    });
});
</script>