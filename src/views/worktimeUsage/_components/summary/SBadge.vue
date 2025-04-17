<template>
  <Card class="h-fit" :class="borderClass">
    <template #content>
      <div class="flex items-center justify-between gap-2">
        <Avatar v-tooltip.top="title" :icon="icon" :class="bgClass" />
        <div class="flex flex-col items-start gap-1 justify-start">
          <span :class="textClass">{{ value }}</span>
        </div>
        <div></div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import NavItem from '@/layouts/default/_components/NavItem.vue';

interface IProps {
  severity: string;
  title: string;
  icon: string;
  value: any;
}

const props = defineProps<IProps>();

// Utility map for dynamic class assignment
const severityMap = {
  success: 'success',
  danger: 'danger',
  warn: 'warn',
  contrast: 'contrast',
  info: 'info',
  primary: 'primary',
};

// Computed properties for border and text classes
const bgClass = computed(() => `card-bg-${severityMap[props.severity] || 'default'}`);
const borderClass = computed(() => `card-border-${severityMap[props.severity] || 'default'}`);
const textClass = computed(() => `card-text-${severityMap[props.severity] || 'default'}`);
</script>

<style scoped>
.card-bg-success {
  @apply bg-f-success text-white;
}
.card-bg-danger {
  @apply bg-f-danger text-white;
}
.card-bg-warn {
  @apply bg-f-warn text-white;
}
.card-bg-secondary {
  @apply bg-f-secondary text-white;
}
.card-bg-info {
  @apply bg-f-info text-white;
}
.card-bg-primary {
  @apply bg-f-primary text-white;
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
