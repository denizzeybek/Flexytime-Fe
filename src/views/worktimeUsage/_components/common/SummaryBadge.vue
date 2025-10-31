<template>
  <Card class="summary-badge h-fit shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border" :class="bgLightClass">
    <template #content>
      <div class="flex items-center justify-center gap-3">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full shadow-sm"
          :class="bgClass"
        >
          <i :class="icon" class="text-white text-base"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 font-medium">{{ title }}</span>
          <span :class="textClass" class="font-bold text-base">{{ value }}</span>
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
const bgLightClass = computed(() => `bg-light-${mappedSeverity.value}`);
</script>

<style>
@reference "@/custom-tailwind.css";

.summary-badge :deep(.p-card-body) {
  @apply !px-3 !py-3;
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

.bg-light-success {
  @apply bg-green-50 border-green-200;
}
.bg-light-danger {
  @apply bg-red-50 border-red-200;
}
.bg-light-warn {
  @apply bg-yellow-50 border-yellow-200;
}
.bg-light-secondary {
  @apply bg-gray-50 border-gray-200;
}
.bg-light-info {
  @apply bg-blue-50 border-blue-200;
}
.bg-light-primary {
  @apply bg-purple-50 border-purple-200;
}
</style>
