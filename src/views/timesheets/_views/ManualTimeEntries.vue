<template>
  <div class="flex flex-col gap-6">
    <EnterTime />
    <Divider />
    <EnteredTimes />
  </div>
</template>

<script setup lang="ts">
import EnteredTimes from '@/views/timesheets/_components/timeEntries/EnteredTimes.vue';
import EnterTime from '@/views/timesheets/_components/timeEntries/EnterTime.vue';
</script>

<style scoped></style>
