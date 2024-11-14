<template>
    <div class="flex flex-col gap-6">
  <EnterTime />
  <EnteredTimes />
</div>
</template>

<script setup lang="ts">
import EnterTime from '@/views/timesheets/_components/timeEntries/EnterTime.vue';
import EnteredTimes from '@/views/timesheets/_components/timeEntries/EnteredTimes.vue';
</script>

<style scoped></style>
