<template>
  <div class="flex items-center gap-2">
    <Avatar
      image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
      shape="circle"
    />
    <div class="text-start">
      <div class="text-md text-f-black">{{ title }}</div>
      <div class="text-sm text-f-text-gray">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';

interface IProps {
  image?: string;
  title: string;
  subTitle?: string;
}

defineProps<IProps>();
</script>

<style scoped></style>
