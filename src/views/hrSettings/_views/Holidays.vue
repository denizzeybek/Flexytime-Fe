<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <HolidaysList />
    </template>
  </Card>
</template>

<script setup lang="ts">
import HolidaysList from '@/views/hrSettings/_components/holidays/HolidaysList.vue';
import Card from 'primevue/card';
</script>

<style scoped></style>
