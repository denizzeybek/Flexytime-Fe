<template>
  <div v-for="i in skeletonCount" :key="i" class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <Skeleton shape="circle" size="2.5rem" />
      <div class="flex flex-col gap-1">
        <Skeleton height="1rem" width="6rem" />
        <Skeleton height="0.75rem" width="3rem" />
      </div>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 p-5 ml-5">
      <div class="flex items-center gap-4">
        <Skeleton shape="circle" size="1.25rem" />
        <div class="flex-1">
          <Skeleton height="1.25rem" width="40%" class="mb-2" />
          <Skeleton height="0.875rem" width="60%" />
        </div>
        <Skeleton height="1.5rem" width="4rem" />
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
