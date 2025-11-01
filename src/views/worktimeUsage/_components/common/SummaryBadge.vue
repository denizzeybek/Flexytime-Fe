<template>
  <Card class="summary-badge h-full shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border" :class="bgLightClass">
    <template #content>
      <div class="flex items-center justify-center gap-3 h-full">
        <div
          class="flex items-center justify-center min-w-10 min-h-10 rounded-full shadow-sm"
          :class="bgClass"
        >
          <i :class="icon" class="text-white text-base"></i>
        </div>
        <div class="flex flex-col items-start justify-center">
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
import { ESeverity } from '@/enums/severity.enum';

interface IProps {
  severity: ESeverity;
  title: string;
  icon: string;
  value: any;
}

const props = defineProps<IProps>();

const severityMap: Record<ESeverity, string> = {
  [ESeverity.SUCCESS]: 'success',
  [ESeverity.DANGER]: 'danger',
  [ESeverity.WARN]: 'warn',
  [ESeverity.WARNING]: 'warn',
  [ESeverity.SECONDARY]: 'secondary',
  [ESeverity.INFO]: 'info',
  [ESeverity.PRIMARY]: 'primary',
  [ESeverity.ERROR]: 'danger',
  [ESeverity.HELP]: 'info',
  [ESeverity.CONTRAST]: 'secondary',
  [ESeverity.LINK]: 'primary',
};

const mappedSeverity = computed(() => severityMap[props.severity] || 'default');

// const borderClass = computed(() => `card-border-${mappedSeverity.value}`);
const textClass = computed(() => `card-text-${mappedSeverity.value}`);
const bgClass = computed(() => `bg-${mappedSeverity.value}`);
const bgLightClass = computed(() => `bg-light-${mappedSeverity.value}`);
</script>

<style scoped>
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
  @apply text-green-700;
}
.card-text-danger {
  @apply text-red-700;
}
.card-text-warn {
  @apply text-orange-700;
}
.card-text-secondary {
  @apply text-slate-700;
}
.card-text-info {
  @apply text-blue-700;
}
.card-text-primary {
  @apply text-purple-700;
}

.bg-success {
  @apply bg-green-500;
}
.bg-danger {
  @apply bg-red-500;
}
.bg-warn {
  @apply bg-orange-500;
}
.bg-secondary {
  @apply bg-slate-500;
}
.bg-info {
  @apply bg-blue-500;
}
.bg-primary {
  @apply bg-purple-500;
}

.bg-light-success {
  @apply bg-green-50/80 border-green-200/50;
}
.bg-light-danger {
  @apply bg-red-50/80 border-red-200/50;
}
.bg-light-warn {
  @apply bg-orange-50/80 border-orange-200/50;
}
.bg-light-secondary {
  @apply bg-slate-50/80 border-slate-200/50;
}
.bg-light-info {
  @apply bg-blue-50/80 border-blue-200/50;
}
.bg-light-primary {
  @apply bg-purple-50/80 border-purple-200/50;
}
</style>
