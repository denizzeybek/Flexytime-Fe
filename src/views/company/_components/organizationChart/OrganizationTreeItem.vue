<template>
  <div class="organization-tree-item w-full" :class="{ highlighted: isHighlighted }" :style="{ paddingLeft: `${depth * 24}px` }">
    <div class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200 w-full">
      <!-- Expand/Collapse Icon -->
      <Button
        v-if="hasChildren"
        :icon="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
        text
        rounded
        size="small"
        class="w-8 h-8 flex-shrink-0"
        @click.stop="setExpanded(!expanded)"
      />
      <div v-else class="w-10 h-8 flex-shrink-0" />

      <!-- Avatar -->
      <FAvatar
        :label="item.title || item.Name || 'N/A'"
        :size="depth === 0 ? 'large' : 'normal'"
        class="flex-shrink-0"
      />

      <!-- Node Info -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
          <!-- Title/Team Name -->
          <div class="font-semibold text-gray-900 truncate" :class="depth === 0 ? 'text-lg' : 'text-base'">
            {{ item.title || item.Name || t('pages.company.organizationChartV2.node.untitled') }}
          </div>

          <!-- Member Name -->
          <div v-if="item.MemberName" class="text-sm text-gray-600 truncate lg:flex-shrink-0">
            <i class="pi pi-user text-xs mr-1" />
            {{ item.MemberName }}
          </div>

          <!-- Title Name (Job Title) -->
          <div v-if="item.TitleName" class="text-sm text-gray-500 truncate lg:flex-shrink-0">
            <i class="pi pi-briefcase text-xs mr-1" />
            {{ item.TitleName }}
          </div>
        </div>
      </div>

      <!-- Children Count Badge -->
      <Badge v-if="hasChildren" :value="childrenCount" severity="info" class="flex-shrink-0" />

      <!-- Action Buttons -->
      <div class="flex gap-1 flex-shrink-0">
        <Button
          v-tooltip.top="t('pages.company.organizationChartV2.node.tooltips.addChild')"
          icon="pi pi-plus"
          severity="success"
          text
          rounded
          size="small"
          @click.stop="handleAddChild"
        />
        <Button
          v-tooltip.top="t('pages.company.organizationChartV2.node.tooltips.edit')"
          icon="pi pi-pencil"
          severity="info"
          text
          rounded
          size="small"
          @click.stop="handleEdit"
        />
        <Button
          v-tooltip.top="t('pages.company.organizationChartV2.node.tooltips.delete')"
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          @click.stop="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

import type { OrganizationTreeNode } from '@/views/company/_types/organizationTree';

interface IProps {
  item: OrganizationTreeNode;
  depth: number;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();

// Inject event handlers from parent
const onEdit = inject<(node: OrganizationTreeNode) => void>('onEdit');
const onDelete = inject<(node: OrganizationTreeNode) => void>('onDelete');
const onAddChild = inject<(node: OrganizationTreeNode) => void>('onAddChild');
const searchQuery = inject<Ref<string>>('searchQuery');

const hasChildren = computed(() => {
  return !!(props.item.children && props.item.children.length > 0);
});

const childrenCount = computed(() => {
  return props.item.children?.length || 0;
});

const isHighlighted = computed(() => {
  const query = searchQuery?.value;
  if (!query) return false;
  const lowerQuery = query.toLowerCase();
  return (
    props.item.title?.toLowerCase().includes(lowerQuery) ||
    props.item.MemberName?.toLowerCase().includes(lowerQuery) ||
    props.item.TitleName?.toLowerCase().includes(lowerQuery) ||
    props.item.Name?.toLowerCase().includes(lowerQuery)
  );
});

const handleEdit = () => {
  onEdit?.(props.item);
};

const handleDelete = () => {
  onDelete?.(props.item);
};

const handleAddChild = () => {
  onAddChild?.(props.item);
};
</script>

<style scoped lang="scss">
.organization-tree-item {
  @apply transition-all duration-200 cursor-grab;

  &:active {
    cursor: grabbing;
  }

  &.highlighted {
    > div {
      @apply ring-2 ring-blue-400 ring-opacity-50 bg-blue-50;
    }
  }
}
</style>
