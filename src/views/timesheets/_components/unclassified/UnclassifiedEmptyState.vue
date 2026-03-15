<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <div class="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-4">
      <i class="pi pi-check-circle text-3xl text-emerald-500 dark:text-emerald-400" />
    </div>
    <h3 class="text-lg font-semibold text-content-secondary mb-2">
      {{ t('pages.timesheets.unclassified.emptyState.title') }}
    </h3>
    <p class="text-content-tertiary text-center max-w-sm">
      {{ t('pages.timesheets.unclassified.emptyState.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
</script>
