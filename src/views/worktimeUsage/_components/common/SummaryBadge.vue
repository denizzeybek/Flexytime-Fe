<template>
  <Card
    class="summary-badge h-full shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border"
    :class="bgLightClass"
  >
    <template #content>
      <div class="flex items-center justify-center gap-3 h-full">
        <div
          class="flex items-center justify-center min-w-10 min-h-10 rounded-full shadow-sm"
          :class="bgClass"
        >
          <Skeleton v-if="isLoading" shape="circle" size="2.5rem" class="!bg-white/30" />
          <i v-else :class="icon" class="text-white text-base"></i>
        </div>
        <div class="flex flex-col items-start justify-center gap-1">
          <Skeleton v-if="isLoading" height="0.75rem" width="4rem" />
          <span v-else class="text-xs text-content-tertiary font-medium">{{ title }}</span>

          <Skeleton v-if="isLoading" height="1rem" width="3rem" />
          <span v-else :class="textClass" class="font-bold text-base">{{ value }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';

import { ESeverity } from '@/enums/severity.enum';

interface IProps {
  severity: ESeverity;
  title: string;
  icon: string;
  value: any;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isLoading: false,
});

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

<style>
.summary-badge .p-card-body {
  padding-inline: calc(var(--spacing, 0.25rem) * 3) !important;
  padding-block: calc(var(--spacing, 0.25rem) * 3) !important;
}
.summary-badge .p-card-content {
  padding: 0 !important;
}
</style>

<style scoped>
@reference "@/tailwind.css";

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
  @apply text-green-700 dark:text-green-400;
}
.card-text-danger {
  @apply text-red-700 dark:text-red-400;
}
.card-text-warn {
  @apply text-orange-700 dark:text-orange-400;
}
.card-text-secondary {
  @apply text-slate-700 dark:text-slate-300;
}
.card-text-info {
  @apply text-blue-700 dark:text-blue-400;
}
.card-text-primary {
  @apply text-purple-700 dark:text-purple-400;
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
  @apply bg-green-50/80 border-green-200/50 dark:bg-green-950/40 dark:border-green-700/30;
}
.bg-light-danger {
  @apply bg-red-50/80 border-red-200/50 dark:bg-red-950/40 dark:border-red-700/30;
}
.bg-light-warn {
  @apply bg-orange-50/80 border-orange-200/50 dark:bg-orange-950/40 dark:border-orange-700/30;
}
.bg-light-secondary {
  @apply bg-slate-50/80 border-slate-200/50 dark:bg-slate-800/40 dark:border-slate-600/30;
}
.bg-light-info {
  @apply bg-blue-50/80 border-blue-200/50 dark:bg-blue-950/40 dark:border-blue-700/30;
}
.bg-light-primary {
  @apply bg-purple-50/80 border-purple-200/50 dark:bg-purple-950/40 dark:border-purple-700/30;
}
</style>
