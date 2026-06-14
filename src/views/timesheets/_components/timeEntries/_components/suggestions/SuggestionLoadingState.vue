<template>
  <div class="space-y-4">
    <div v-for="i in skeletonCount" :key="i" class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <Skeleton shape="circle" size="2rem" />
        <div class="flex flex-col gap-1">
          <Skeleton height="0.875rem" width="6rem" />
          <Skeleton height="0.625rem" width="3rem" />
        </div>
      </div>
      <div class="bg-surface-primary rounded-xl border border-border-secondary dark:border-border-primary p-3 ml-2 transition-colors">
        <div class="flex items-center gap-3">
          <Skeleton shape="circle" size="1rem" />
          <div class="flex-1">
            <Skeleton height="1rem" width="40%" class="mb-2" />
            <Skeleton height="0.75rem" width="60%" />
          </div>
          <Skeleton height="1.25rem" width="3.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton';

interface IProps {
  skeletonCount?: number;
}

withDefaults(defineProps<IProps>(), {
  skeletonCount: 3,
});
</script>
