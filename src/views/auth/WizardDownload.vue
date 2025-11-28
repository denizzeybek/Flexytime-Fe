<template>
  <AuthLayout adName="download">
    <div class="flex flex-col justify-center w-1/2 h-full">
      <Download :is-wizard="true">
        <template #skipBtn>
          <Button
            severity="contrast"
            class="!px-12"
            :label="$t('pages.auth.wizardDownload.skipButton')"
            @click="router.push({ name: ERouteNames.WorktimeUsage })"
          />
        </template>
      </Download>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { ERouteNames } from '@/router/routeNames.enum';

import Download from '../download/_views/Download.vue';

const router = useRouter();
</script>
