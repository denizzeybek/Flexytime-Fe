<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-50 px-4">
    <div class="w-full max-w-md text-center">
      <!-- Error Icon -->
      <div class="mb-6">
        <div
          class="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Error Message Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h1 class="text-6xl font-bold text-slate-900 mb-4">403</h1>
        <h2 class="text-2xl font-semibold text-slate-800 mb-3">
          {{ $t('components.errors.unauthorized.title') }}
        </h2>
        <p class="text-slate-600 mb-6">
          {{ $t('components.errors.unauthorized.description') }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            :label="$t('components.errors.unauthorized.actions.goBack')"
            severity="secondary"
            outlined
            icon="pi pi-arrow-left"
            @click="goBack"
          />
          <Button
            :label="$t('components.errors.unauthorized.actions.goHome')"
            icon="pi pi-home"
            @click="goHome"
          />
        </div>

        <!-- Additional Info -->
        <div class="mt-6 pt-6 border-t border-slate-200">
          <p class="text-sm text-slate-500">
            {{ $t('components.errors.unauthorized.helpText') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import Button from 'primevue/button';

import { ERouteNames } from '@/router/routeNames.enum';

const router = useRouter();

const goBack = (): void => {
  router.back();
};

const goHome = (): void => {
  router.push({ name: ERouteNames.WorktimeUsage });
};
</script>
