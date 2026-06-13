<template>
  <div
    class="org-node group flex flex-col items-center p-3 rounded-xl transition-all duration-200 bg-surface-primary border-2 border-border-secondary dark:border-border-primary hover:border-border-focus hover:shadow-md"
  >
    <!-- Drag Handle -->
    <Handle type="target" :position="Position.Top" class="!bg-border-secondary dark:!bg-border-primary !w-3 !h-1.5 !rounded-full !border-0" />

    <div
      class="org-node__actions absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Button
        v-tooltip.top="t('pages.company.organizationChartV2.buttons.tooltips.addChild')"
        icon="pi pi-plus"
        severity="secondary"
        rounded
        text
        class="!w-6 !h-6 !p-0 !bg-surface-primary !border !border-border-secondary"
        @click.stop="handleAddChild"
      />
      <Button
        v-tooltip.top="t('pages.company.organizationChartV2.buttons.tooltips.edit')"
        icon="pi pi-pencil"
        severity="secondary"
        rounded
        text
        class="!w-6 !h-6 !p-0 !bg-surface-primary !border !border-border-secondary"
        @click.stop="handleEdit"
      />
      <Button
        v-tooltip.top="t('pages.company.organizationChartV2.buttons.tooltips.delete')"
        icon="pi pi-trash"
        severity="danger"
        rounded
        text
        class="!w-6 !h-6 !p-0 !bg-surface-primary !border !border-border-secondary"
        @click.stop="handleDelete"
      />
    </div>

    <Avatar
      :label="avatarLabel"
      class="mb-2 !w-10 !h-10 !text-sm font-semibold bg-gradient-to-br from-surface-tertiary to-surface-secondary text-content-secondary"
      shape="circle"
    />

    <div class="text-center w-full max-w-[140px]">
      <p
        class="font-semibold text-content-primary text-xs mb-0.5 truncate"
        :title="primaryText"
      >
        {{ primaryText }}
      </p>

      <Tag
        v-if="nodeData.titleName"
        :value="nodeData.titleName"
        severity="info"
        class="!text-[9px] !px-1.5 !py-0.5 mb-1"
      />

      <div
        v-if="hasMember && nodeData.label"
        class="flex items-center justify-center gap-1 text-[9px] text-content-tertiary mt-1 truncate"
        :title="nodeData.label"
      >
        <i class="pi pi-users text-[8px]" />
        <span class="truncate">{{ nodeData.label }}</span>
      </div>
    </div>

    <!-- Source Handle -->
    <Handle type="source" :position="Position.Bottom" class="!bg-border-secondary dark:!bg-border-primary !w-3 !h-1.5 !rounded-full !border-0" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { Handle, Position } from '@vue-flow/core';

import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

import type { MessageSchema } from '@/plugins/i18n';

import type { IOrganizationNodeData } from '../../_types/organizationChartV2';
import type { NodeProps } from '@vue-flow/core';

const props = defineProps<NodeProps<IOrganizationNodeData>>();

const { t } = useI18n<{ message: MessageSchema }>();

const nodeData = computed(() => props.data as IOrganizationNodeData);
const hasMember = computed(() => !!nodeData.value?.memberName);
const primaryText = computed(() => nodeData.value?.memberName || nodeData.value?.label || '—');

/**
 * Inject the page-level action handlers (parity with v1's
 * OrganizationTreeItem.vue pattern). Each callback takes the API node
 * ID — the page-level reducer (OrganizationChartV2.vue) looks the node
 * up in `apiTreeData` and opens the right dialog with the right state.
 */
const onEdit = inject<(id: string) => void>('onEdit');
const onDelete = inject<(id: string) => void>('onDelete');
const onAddChild = inject<(id: string) => void>('onAddChild');

const handleEdit = () => onEdit?.(props.id);
const handleDelete = () => onDelete?.(props.id);
const handleAddChild = () => onAddChild?.(props.id);

const avatarLabel = computed(() => {
  const data = nodeData.value;
  if (!data) return '?';

  if (data.abbreviation) {
    return data.abbreviation.substring(0, 2).toUpperCase();
  }

  const name = data.memberName || data.label || '';
  if (!name) return '?';

  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});
</script>

<style scoped>
.org-node {
  position: relative;
  min-width: 150px;
}
</style>
