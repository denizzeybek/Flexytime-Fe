<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-3">
      <i class="pi pi-check-circle text-2xl text-emerald-500 dark:text-emerald-400" />
    </div>
    <h3 class="text-base font-semibold text-content-secondary mb-1">
      {{ t('pages.timesheets.timeEntries.suggestions.emptyState.title') }}
    </h3>
    <p class="text-sm text-content-tertiary text-center max-w-xs">
      {{ t('pages.timesheets.timeEntries.suggestions.emptyState.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
</script>
