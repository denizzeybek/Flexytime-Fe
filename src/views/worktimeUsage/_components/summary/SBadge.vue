<template>
  <Card class="summary-badge h-fit" :class="borderClass">
    <template #content>
      <div class="flex items-center justify-center gap-2">
        <SBadgeIcon :severity="severity" :title="title" :icon="icon" />
        <span :class="textClass">{{ value }}</span>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import { SeverityMap } from '@/views/worktimeUsage/_etc/severityMap';
import SBadgeIcon from '@/views/worktimeUsage/_components/summary/SBadgeIcon.vue';

interface IProps {
  severity: string;
  title: string;
  icon: string;
  value: any;
}

const props = defineProps<IProps>();

const borderClass = computed(() => `card-border-${SeverityMap[props.severity] || 'default'}`);
const textClass = computed(() => `card-text-${SeverityMap[props.severity] || 'default'}`);
</script>

<style>
.summary-badge .p-card-body{
  @apply !px-2;
}

.card-border-success {
  @apply border border-f-success;
}
.card-border-danger {
  @apply border border-f-danger;
}
.card-border-warn {
  @apply border border-f-warn;
}
.card-border-secondary {
  @apply border border-f-secondary;
}
.card-border-info {
  @apply border border-f-info;
}
.card-border-primary {
  @apply border border-f-primary;
}

.card-text-success {
  @apply text-f-success;
}
.card-text-danger {
  @apply text-f-danger;
}
.card-text-warn {
  @apply text-f-warn;
}
.card-text-secondary {
  @apply text-f-secondary;
}
.card-text-info {
  @apply text-f-info;
}
.card-text-primary {
  @apply text-f-primary;
}
</style>
