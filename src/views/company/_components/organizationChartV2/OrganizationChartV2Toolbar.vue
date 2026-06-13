<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl mb-4 transition-colors">
    <template #content>
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-xl font-semibold text-content-primary">
          {{ t('pages.company.organizationChart.title') }}
        </h2>

        <Button
          :label="t('pages.company.organizationChartV2.buttons.addRootTeam')"
          icon="pi pi-plus"
          severity="primary"
          @click="$emit('addRootNode')"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import Card from 'primevue/card';

import type { MessageSchema } from '@/plugins/i18n';

defineEmits<{
  (e: 'addRootNode'): void;
}>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>
