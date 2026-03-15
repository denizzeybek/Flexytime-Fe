<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl transition-colors">
    <template #content>
      <div class="text-center py-12">
        <i class="pi pi-sitemap text-6xl text-content-quaternary mb-4"></i>
        <p class="text-xl text-content-secondary mb-4">
          {{ hasSearchQuery ? t('pages.company.organizationChartV2.emptyState.noResults') : t('pages.company.organizationChartV2.emptyState.noData') }}
        </p>
        <Button
          v-if="!hasSearchQuery"
          :label="t('pages.company.organizationChartV2.buttons.addFirstTeam')"
          icon="pi pi-plus"
          @click="$emit('addRootNode')"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  hasSearchQuery: boolean;
}

interface IEmits {
  (e: 'addRootNode'): void;
}

defineProps<IProps>();
defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>
