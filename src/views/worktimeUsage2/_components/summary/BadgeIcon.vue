<template>
  <Avatar v-tooltip.top="title" :icon="icon" :class="bgClass" :size="size" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from 'primevue/avatar';
import type { AvatarProps } from 'primevue/avatar';
import { SEVERITY_MAP } from '../../_utils/constants';

interface Props {
  severity: string;
  title: string;
  icon: string;
  size?: AvatarProps['size'];
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
});

const bgClass = computed(() => `card-bg-${SEVERITY_MAP[props.severity as keyof typeof SEVERITY_MAP] || 'default'}`);
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