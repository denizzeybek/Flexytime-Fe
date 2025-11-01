<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <CompaniesList />
    </template>
  </Card>
</template>

<script setup lang="ts">
import CompaniesList from '@/views/settings/_components/companies/CompaniesList.vue';
import Card from 'primevue/card';
</script>

<style scoped></style>
