<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <TeamsAndTitlesList />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

import TeamsAndTitlesList from '@/views/hrSettings/_components/teamsAndTitles/TeamsAndTitlesList.vue';
</script>

<style scoped></style>
