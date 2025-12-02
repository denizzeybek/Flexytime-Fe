<template>
  <div class="relative max-w-lg mx-auto py-16">
    <div class="text-center">
      <!-- Success Animation -->
      <div class="relative inline-flex mb-8">
        <div class="absolute inset-0 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
        <div class="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
          <i class="pi pi-check text-5xl text-white"></i>
        </div>
      </div>

      <h2 class="text-3xl font-bold text-gray-900 mb-3">{{ title }}</h2>
      <p class="text-gray-500 mb-10 max-w-sm mx-auto">{{ description }}</p>

      <Button
        :label="buttonLabel"
        icon="pi pi-arrow-right"
        icon-pos="right"
        class="px-8 py-3 text-base"
        @click="emit('action')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  title: string;
  description: string;
  buttonLabel: string;
}

interface IEmits {
  (e: 'action'): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();
</script>
