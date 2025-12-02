<template>
  <div class="bg-blue-500 p-6 text-white">
    <div class="flex items-center justify-between mb-4">
      <span class="text-white text-sm">{{ label }}</span>
      <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
        <i class="pi pi-check text-sm"></i>
      </div>
    </div>
    <h3 class="text-2xl font-bold mb-1">{{ planName }}</h3>
    <div class="flex items-baseline gap-1">
      <span class="text-4xl font-bold">${{ price }}</span>
      <span class="text-white/70">/{{ intervalLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  label: string;
  planName: string;
  price: number;
  intervalLabel: string;
}

defineProps<IProps>();
</script>
