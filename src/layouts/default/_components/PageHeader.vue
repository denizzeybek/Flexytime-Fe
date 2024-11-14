<template>
  <div class="flex justify-between items-center ">
    <div class="flex items-center">
      <div class="block lg:hidden">
        <Button size="large" icon="pi pi-bars" unstyled @click="$emit('drawerChange', true)" />
      </div>
      <div class=":pl-4 lg:pl-0  text-2xl">{{ route.name }}</div>
    </div>
    <div class="hidden lg:flex gap-3">
      <Button size="large" icon="pi pi-shopping-cart" label="Upgrade" severity="warn" />
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
