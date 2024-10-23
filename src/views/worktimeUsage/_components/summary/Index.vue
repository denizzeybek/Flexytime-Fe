<template>
  <div class="flex flex-col h-full flex-1">
    <div class="flex md:flex-row flex-col justify-between md:items-center items-start gap-2 md:gap-0 w-full">
      <SBreadcrumb />
      <SActions />
    </div>
    <div class="mt-auto mb-auto"></div>
    <div>
      <SBadgeGroup />
    </div>
  </div>
</template>

<script setup lang="ts">
import SBreadcrumb from './SBreadcrumb.vue';
import SActions from './SActions.vue';
import SBadgeGroup from './SBadgeGroup.vue';
</script>

<style scoped></style>
