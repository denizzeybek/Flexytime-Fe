<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden mb-4">
    <template #content>
      <div class="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div class="flex-1 w-full lg:w-auto">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText
              :model-value="searchQuery"
              :placeholder="t('pages.company.organizationChartV2.search.placeholder')"
              class="w-full"
              @update:model-value="$emit('update:searchQuery', $event ?? '')"
            />
          </IconField>
        </div>
        <div class="flex gap-2 w-full lg:w-auto flex-wrap">
          <!-- Undo Control -->
          <Button
            v-tooltip.top="t('pages.company.organizationChartV2.buttons.undo')"
            icon="pi pi-undo"
            severity="secondary"
            outlined
            size="small"
            :disabled="!canUndo"
            @click="$emit('undo')"
          />

          <Button
            :label="expandAll ? t('pages.company.organizationChartV2.buttons.collapseAll') : t('pages.company.organizationChartV2.buttons.expandAll')"
            :icon="expandAll ? 'pi pi-minus' : 'pi pi-plus'"
            severity="secondary"
            outlined
            size="small"
            @click="$emit('toggleExpandAll')"
          />
          <Button
            :label="t('pages.company.organizationChartV2.buttons.addRootTeam')"
            icon="pi pi-plus"
            @click="$emit('addRootNode')"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  searchQuery: string;
  canUndo: boolean;
  expandAll: boolean;
}

interface IEmits {
  (e: 'update:searchQuery', value: string): void;
  (e: 'undo'): void;
  (e: 'toggleExpandAll'): void;
  (e: 'addRootNode'): void;
}

defineProps<IProps>();
defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>
