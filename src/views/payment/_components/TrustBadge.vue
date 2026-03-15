<template>
  <div class="flex items-center gap-2 text-content-tertiary">
    <div
      class="w-8 h-8 rounded-lg flex items-center justify-center"
      :class="bgColorClass"
    >
      <i
        class="text-sm"
        :class="[icon, iconColorClass]"
      ></i>
    </div>
    <span class="text-sm">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type BadgeColor = 'green' | 'blue' | 'purple';

interface IProps {
  icon: string;
  label: string;
  color: BadgeColor;
}

const props = defineProps<IProps>();

const colorMap: Record<BadgeColor, { bg: string; icon: string }> = {
  green: { bg: 'bg-green-50 dark:bg-green-950/40', icon: 'text-green-500 dark:text-green-400' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', icon: 'text-blue-500 dark:text-blue-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', icon: 'text-purple-500 dark:text-purple-400' },
};

const bgColorClass = computed(() => colorMap[props.color].bg);
const iconColorClass = computed(() => colorMap[props.color].icon);
</script>
