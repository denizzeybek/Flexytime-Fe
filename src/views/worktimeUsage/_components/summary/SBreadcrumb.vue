<template>
  <div class="bg-f-white px-5 py-2 rounded-xl flex justify-center">
    <Breadcrumb :home="home" :model="items" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const home = ref({
  icon: 'pi pi-home',
});
const items = ref([{ label: 'Electronics' }, { label: 'Computer' }, { label: 'Accessories' }]);
</script>
