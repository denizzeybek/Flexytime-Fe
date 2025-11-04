<template>
  <div class="flex items-center gap-2">
    <Avatar
      image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
      shape="circle"
    />
    <div class="text-start">
      <span v-if="onlyTitle"  class="text-md text-f-black">{{
        title
      }}</span>
      <RouterLink v-else :to="{ name: ERouteNames.ProfileBasic }" class="text-md text-f-black">{{
        title
      }}</RouterLink>
      <div class="text-sm text-f-text-gray">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';

import { ERouteNames } from '@/router/routeNames.enum';

interface IProps {
  image?: string;
  title: string;
  subTitle?: string;
  onlyTitle?: boolean;
}

defineProps<IProps>();
</script>

<style scoped></style>
