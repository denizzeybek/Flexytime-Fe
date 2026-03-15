<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <TitlesTable />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

import TitlesTable from '@/views/hrSettings/_components/teamsAndTitles/TitlesTable.vue';
</script>
