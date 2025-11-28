<template>
  <div class="flex items-center gap-2">
    <div class="text-start">
      <RouterLink :to="{ name: ERouteNames.ProfileBasic }" class="text-md text-f-black">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';

import { ERouteNames } from '@/router/routeNames.enum';

interface IProps {
  image?: string;
  title: string;
  onlyTitle?: boolean;
}

defineProps<IProps>();
</script>

<style scoped></style>
