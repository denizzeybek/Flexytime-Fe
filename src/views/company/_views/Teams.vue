<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <TeamsTable />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

import TeamsTable from '@/views/hrSettings/_components/teamsAndTitles/TeamsTable.vue';
</script>
