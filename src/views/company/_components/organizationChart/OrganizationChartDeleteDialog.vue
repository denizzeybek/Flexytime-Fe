<template>
  <Dialog
    :visible="visible"
    :header="t('pages.company.organizationChartV2.deleteDialog.title')"
    :modal="true"
    :closable="true"
    class="w-full max-w-md"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="flex gap-3 items-start">
      <i class="pi pi-exclamation-triangle text-orange-500 text-2xl"></i>
      <div>
        <p class="mb-2">{{ t('pages.company.organizationChartV2.deleteDialog.message') }}</p>
        <p v-if="node?.title" class="font-semibold">{{ node.title }}</p>
        <p v-if="hasChildren" class="text-sm text-orange-600 mt-2">
          {{ t('pages.company.organizationChartV2.deleteDialog.warningChildren') }}
        </p>
      </div>
    </div>
    <template #footer>
      <Button
        :label="t('pages.company.organizationChartV2.deleteDialog.cancel')"
        severity="secondary"
        outlined
        @click="$emit('update:visible', false)"
      />
      <Button
        :label="t('pages.company.organizationChartV2.deleteDialog.confirm')"
        severity="danger"
        @click="$emit('confirm')"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

import type { OrganizationNodeViewModel } from '@/client';

interface IProps {
  visible: boolean;
  node: OrganizationNodeViewModel | null;
}

interface IEmits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm'): void;
}

const props = defineProps<IProps>();
defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const hasChildren = computed(() => {
  return !!(props.node?.children && props.node.children.length > 0);
});
</script>
