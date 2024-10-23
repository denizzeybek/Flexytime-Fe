<template>
  <Card>
    <template #content>
      <div class="flex justify-between !gap-2">
        <SBadge severity="success" title="Work" value="04:58" />
        <SBadge severity="danger" title="Leisure" value="04:58" />
        <SBadge severity="warn" title="Meeting" value="04:58" />
        <SBadge severity="contrast" title="Unclassified" value="04:58" />
        <SBadge severity="info" title="Start Time" value="04:58" />
        <SBadge severity="primary" title="End Time" value="04:58" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import SBadge from './SBadge.vue';
</script>

<style scoped></style>
