<template>
  <div
    class="group text-center p-8 rounded-2xl transition-all duration-500"
    :class="hoverBgClass"
  >
    <div
      class="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
      :class="[bgColorClass, hoverIconBgClass, hoverShadowClass]"
    >
      <i
        class="text-2xl transition-colors duration-300 group-hover:text-white"
        :class="[icon, iconColorClass]"
      ></i>
    </div>
    <h3 class="font-bold text-content-primary mb-3">{{ title }}</h3>
    <p class="text-content-tertiary text-sm leading-relaxed">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FeatureColor = 'blue' | 'green' | 'purple';

interface IProps {
  icon: string;
  title: string;
  description: string;
  color: FeatureColor;
}

const props = defineProps<IProps>();

const colorMap: Record<FeatureColor, {
  bg: string;
  icon: string;
  hoverBg: string;
  hoverIconBg: string;
  hoverShadow: string;
}> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    icon: 'text-blue-500 dark:text-blue-400',
    hoverBg: 'hover:bg-blue-100/30 dark:hover:bg-blue-900/30',
    hoverIconBg: 'group-hover:bg-blue-500',
    hoverShadow: 'group-hover:shadow-blue-500/25',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/40',
    icon: 'text-green-500 dark:text-green-400',
    hoverBg: 'hover:bg-green-100/30 dark:hover:bg-green-900/30',
    hoverIconBg: 'group-hover:bg-green-500',
    hoverShadow: 'group-hover:shadow-green-500/25',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    icon: 'text-purple-500 dark:text-purple-400',
    hoverBg: 'hover:bg-purple-100/30 dark:hover:bg-purple-900/30',
    hoverIconBg: 'group-hover:bg-purple-500',
    hoverShadow: 'group-hover:shadow-purple-500/25',
  },
};

const bgColorClass = computed(() => colorMap[props.color].bg);
const iconColorClass = computed(() => colorMap[props.color].icon);
const hoverBgClass = computed(() => colorMap[props.color].hoverBg);
const hoverIconBgClass = computed(() => colorMap[props.color].hoverIconBg);
const hoverShadowClass = computed(() => colorMap[props.color].hoverShadow);
</script>
