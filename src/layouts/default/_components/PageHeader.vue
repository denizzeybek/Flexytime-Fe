<template>
  <div class="flex justify-between items-center">
    <div>
      <div class="block lg:hidden">
        <Button icon="pi pi-bars" unstyled @click="$emit('drawerChange', true)" />
      </div>
      <div class="hidden pl-4 lg:block text-2xl">{{ route.name }}</div>
    </div>
    <div class="hidden lg:flex gap-3">
      <Button class="!px-6" icon="pi pi-shopping-cart" label="Upgrade" severity="warn" />
      <Button class="!px-6" icon="pi pi-youtube" severity="danger" />
      <Button class="!px-6" icon="pi pi-question" outlined severity="contrast" />
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
