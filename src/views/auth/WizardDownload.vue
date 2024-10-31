<template>
  <AuthLayout adName="download">
    <div class="flex flex-col justify-center w-1/2 h-full">
      <Download :is-wizard="true">
        <template #skipBtn>
          <Button
            @click="router.push({ name: ERouteNames.WorktimeUsage })"
            severity="contrast"
            class="!px-12"
            label="Skip"
          />
        </template>
      </Download>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ERouteNames } from '@/router/routeNames.enum';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import Download from '../download/_views/Download.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
