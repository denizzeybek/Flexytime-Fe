<template>
  <div class="bg-f-white px-5 py-2 rounded-xl flex justify-center w-full lg:w-fit">
    <Skeleton v-if="sectionsStore.isLoading" height="1rem" width="20rem" />

    <Breadcrumb v-else :home="home" :model="breadCrumb">
      <template #item="{ item, props }">
        <!-- {{ item }} -->
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

<script setup>
import { ref, computed } from 'vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import Skeleton from 'primevue/skeleton';

const home = ref({
  icon: 'pi pi-home',
  route: '/clock/section/productivity-team',
});

const sectionsStore = useSectionsStore();

const breadCrumb = computed(() => {
  return sectionsStore.Breadcrumb.map((b) => {
    return {
      id: b.id,
      label: b.title,
      route: `/clock/section/productivity-team?teamId=${b.id}`,
    };
  });
});
</script>
