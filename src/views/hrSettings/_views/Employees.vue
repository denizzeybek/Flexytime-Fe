<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <EmployeesList />
    </template>
  </Card>
</template>

<script setup lang="ts">
import EmployeesList from '@/views/hrSettings/_components/employees/EmployeesList.vue';
import Card from 'primevue/card';
</script>

<style scoped></style>
