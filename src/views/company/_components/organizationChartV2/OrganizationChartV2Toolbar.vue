<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl mb-4 transition-colors">
    <template #content>
      <div class="flex items-center">
        <h2 class="text-xl font-semibold text-content-primary">
          {{ t('pages.company.organizationChart.title') }}
        </h2>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';

import type { MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
</script>
