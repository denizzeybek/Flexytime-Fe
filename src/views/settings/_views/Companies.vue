<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors">
    <template #content>
      <CompaniesList />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

import CompaniesList from '@/views/settings/_components/companies/CompaniesList.vue';
</script>

<style scoped></style>
