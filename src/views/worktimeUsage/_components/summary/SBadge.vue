<template>
  <div
    :class="['!flex-1 border h-[72px] flex items-center !rounded-xl !p-4', borderClass]"
    outlined
  >
    <div class="flex items-center gap-2">
      <Button :severity="severity" icon="pi pi-clock" class="!w-8 !h-8 !rounded-md"></Button>
      <div class="flex flex-col justify-start">
        <div :class="[textClass, 'text-sm']">{{ title }}</div>
        <div class="text-f-black text-sm">{{ value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
  severity: string;
  title: string;
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
const borderClass = computed(() => `card-border-${severityMap[props.severity] || 'default'}`);
const textClass = computed(() => `card-text-${severityMap[props.severity] || 'default'}`);
</script>

<style scoped>
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
