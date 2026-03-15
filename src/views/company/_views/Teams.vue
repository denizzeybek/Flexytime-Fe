<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors">
    <template #content>
      <TeamsTable />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

import TeamsTable from '@/views/hrSettings/_components/teamsAndTitles/TeamsTable.vue';
</script>
