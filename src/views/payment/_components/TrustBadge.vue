<template>
  <div class="flex items-center gap-2 text-gray-500">
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
  green: { bg: 'bg-green-50', icon: 'text-green-500' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-500' },
};

const bgColorClass = computed(() => colorMap[props.color].bg);
const iconColorClass = computed(() => colorMap[props.color].icon);
</script>
