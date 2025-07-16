<template>
  <Avatar v-tooltip.top="title" :icon="icon" :class="bgClass" :size="size" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from 'primevue/avatar';
import { SeverityMap } from '@/views/worktimeUsage/_etc/severityMap';
import type { AvatarProps } from 'primevue/avatar';
interface IProps {
  severity: string;
  title: string;
  icon: string;
  size?: AvatarProps['size'];
}

const props = withDefaults(defineProps<IProps>(), {
  size: 'normal',
});

const bgClass = computed(() => `card-bg-${SeverityMap[props.severity] || 'default'}`);
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
</style>
