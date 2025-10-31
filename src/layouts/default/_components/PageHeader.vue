<template>
  <div class="flex justify-between items-center py-4 px-6 bg-white rounded-2xl shadow-lg border border-gray-100">
    <div class="flex items-center gap-3">
      <div class="block lg:hidden">
        <Button size="large" icon="pi pi-bars" text rounded @click="$emit('drawerChange', true)" />
      </div>
      <h1 class="text-3xl font-semibold text-gray-800 tracking-tight">{{ route.name }}</h1>
    </div>
    <div class="hidden lg:flex items-center gap-3">
      <Button
        size="large"
        icon="pi pi-shopping-cart"
        label="Upgrade"
        severity="warn"
        class="shadow-md hover:shadow-lg transition-all"
      />
      <!-- <Button size="large" icon="pi pi-youtube" severity="danger" /> -->
      <!-- <Button size="large" icon="pi pi-question" outlined severity="contrast" /> -->
      <ProfileMenu />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileMenu from '@/components/ui/local/ProfileMenu.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface IEmits {
  (event: 'drawerChange', val: boolean): void;
}

defineEmits<IEmits>();
</script>
