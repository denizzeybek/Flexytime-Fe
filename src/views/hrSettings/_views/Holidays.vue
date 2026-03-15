<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors">
    <template #content>
      <HolidaysList />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

import HolidaysList from '@/views/hrSettings/_components/holidays/HolidaysList.vue';
</script>

<style scoped></style>
