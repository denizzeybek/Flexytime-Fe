<template>
  <div class="hidden sm:block">
    <Card class="w-40 h-full">
      <template #footer>
        <div class="flex flex-col items-center justify-center gap-3">
          <Avatar size="xlarge" icon="pi pi-user" shape="circle" />
          <div class="text-md text-center">{{ userCard?.Name || 'User' }}</div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { computed } from 'vue';

const sectionsStore = useSectionsStore();

const userCard = computed(() => sectionsStore.Card || { Name: 'User' });
</script>