<template>
  <Card class="w-full h-fit">
    <template #content>
      <div class="flex flex-col h-full flex-1">
        <div class="flex md:flex-row flex-col justify-between md:items-center items-start gap-2 md:gap-0 w-full">
          <BreadcrumbNavigation />
          <FilterActions />
        </div>
        
        <div class="mt-auto mb-auto"></div>
        
        <div>
          <BadgeGroup />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import BreadcrumbNavigation from './BreadcrumbNavigation.vue';
import FilterActions from './FilterActions.vue';
import BadgeGroup from './BadgeGroup.vue';
</script>