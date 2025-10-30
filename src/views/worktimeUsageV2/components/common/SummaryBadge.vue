<template>
  <Card class="summary-badge h-fit" :class="borderClass">
    <template #content>
      <div class="flex items-center justify-center gap-2">
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full"
          :class="bgClass"
        >
          <i :class="icon" class="text-white text-sm"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-600">{{ title }}</span>
          <span :class="textClass" class="font-semibold">{{ value }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';

interface IProps {
  severity: string;
  title: string;
  icon: string;
  value: any;
}

const props = defineProps<IProps>();

const severityMap: Record<string, string> = {
  success: 'success',
  danger: 'danger',
  warn: 'warn',
  warning: 'warn',
  secondary: 'secondary',
  info: 'info',
  primary: 'primary',
};

const mappedSeverity = computed(() => severityMap[props.severity] || 'default');

const borderClass = computed(() => `card-border-${mappedSeverity.value}`);
const textClass = computed(() => `card-text-${mappedSeverity.value}`);
const bgClass = computed(() => `bg-${mappedSeverity.value}`);
</script>

<style>
@reference "@/custom-tailwind.css";

.summary-badge :deep(.p-card-body) {
  @apply !px-2 !py-2;
}

.summary-badge :deep(.p-card-content) {
  @apply !p-0;
}

.card-border-success {
  @apply border border-green-500;
}
.card-border-danger {
  @apply border border-red-500;
}
.card-border-warn {
  @apply border border-yellow-500;
}
.card-border-secondary {
  @apply border border-gray-500;
}
.card-border-info {
  @apply border border-blue-500;
}
.card-border-primary {
  @apply border border-purple-500;
}

.card-text-success {
  @apply text-green-600;
}
.card-text-danger {
  @apply text-red-600;
}
.card-text-warn {
  @apply text-yellow-600;
}
.card-text-secondary {
  @apply text-gray-600;
}
.card-text-info {
  @apply text-blue-600;
}
.card-text-primary {
  @apply text-purple-600;
}

.bg-success {
  @apply bg-green-500;
}
.bg-danger {
  @apply bg-red-500;
}
.bg-warn {
  @apply bg-yellow-500;
}
.bg-secondary {
  @apply bg-gray-500;
}
.bg-info {
  @apply bg-blue-500;
}
.bg-primary {
  @apply bg-purple-500;
}
</style>
