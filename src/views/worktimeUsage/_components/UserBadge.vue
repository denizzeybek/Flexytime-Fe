<template>
  <div class="hidden sm:block">
    <Card class="w-40 h-full">
      <template #footer>
        <div class="flex flex-col items-center justify-center gap-3">
          <template v-if="sectionsStore.isLoading">
            <Skeleton shape="circle" size="4rem" class="mr-2" />
            <Skeleton height="1rem" />
          </template>
          <template v-else>
            <Avatar size="xlarge" icon="pi pi-user" shape="circle" />
            <div class="text-md text-center">{{ card.Name }}</div>
          </template>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';
import Skeleton from 'primevue/skeleton';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { computed } from 'vue';

const sectionsStore = useSectionsStore();

const card = computed(() => sectionsStore.Card);
</script>

<style scoped></style>
