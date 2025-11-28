<template>
  <div class="organization-node" :class="{ 'highlighted': isHighlighted, 'drag-over': isDragOver }">
    <!-- Node Card -->
    <div
      class="node-card"
      :style="{ marginLeft: `${depth * 24}px` }"
      draggable="true"
      @dragstart="onDragStart"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
        <!-- Expand/Collapse Icon -->
        <Button
          v-if="hasChildren"
          :icon="isExpanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
          text
          rounded
          size="small"
          class="w-8 h-8 flex-shrink-0"
          @click="handleToggleExpand"
        />
        <div v-else class="w-10 h-8 flex-shrink-0"></div>

        <!-- Avatar -->
        <FAvatar
          :label="node.title || node.Name || 'N/A'"
          :size="depth === 0 ? 'large' : 'normal'"
          class="flex-shrink-0"
        />

        <!-- Node Info -->
        <div class="flex-1 min-w-0">
          <div class="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
            <!-- Title/Team Name -->
            <div class="font-semibold text-gray-900 truncate" :class="depth === 0 ? 'text-lg' : 'text-base'">
              {{ node.title || node.Name || t('pages.company.organizationChartV2.node.untitled') }}
            </div>

            <!-- Member Name -->
            <div v-if="node.MemberName" class="text-sm text-gray-600 truncate lg:flex-shrink-0">
              <i class="pi pi-user text-xs mr-1"></i>
              {{ node.MemberName }}
            </div>

            <!-- Title Name (Job Title) -->
            <div v-if="node.TitleName" class="text-sm text-gray-500 truncate lg:flex-shrink-0">
              <i class="pi pi-briefcase text-xs mr-1"></i>
              {{ node.TitleName }}
            </div>
          </div>
        </div>

        <!-- Children Count Badge -->
        <Badge
          v-if="hasChildren"
          :value="childrenCount"
          severity="info"
          class="flex-shrink-0"
        />

        <!-- Action Buttons -->
        <div class="flex gap-1 flex-shrink-0">
          <Button
            v-tooltip.top="t('pages.company.organizationChartV2.node.tooltips.addChild')"
            icon="pi pi-plus"
            severity="success"
            text
            rounded
            size="small"
            @click="handleAddChild"
          />
          <Button
            v-tooltip.top="t('pages.company.organizationChartV2.node.tooltips.edit')"
            icon="pi pi-pencil"
            severity="info"
            text
            rounded
            size="small"
            @click="handleEdit"
          />
          <Button
            v-tooltip.top="t('pages.company.organizationChartV2.node.tooltips.delete')"
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            size="small"
            @click="handleDelete"
          />
        </div>
      </div>
    </div>

    <!-- Children Nodes -->
    <Transition name="expand">
      <div v-if="isExpanded && hasChildren" class="children-container mt-2">
        <div class="relative">
          <!-- Vertical Line -->
          <div
            v-if="depth < 3"
            class="absolute left-0 top-0 bottom-0 w-px bg-gray-300"
            :style="{ marginLeft: `${depth * 24 + 28}px` }"
          ></div>

          <!-- Child Nodes -->
          <OrganizationNodeV2
            v-for="child in node.children"
            :key="child.ID"
            :node="child"
            :depth="depth + 1"
            :expanded-nodes="expandedNodes"
            :search-query="searchQuery"
            :drag-over-node-id="dragOverNodeId"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @add-child="$emit('add-child', $event)"
            @toggle-expand="$emit('toggle-expand', $event)"
            @drag-start="$emit('drag-start', $event)"
            @drag-over="$emit('drag-over', $event)"
            @drag-leave="$emit('drag-leave')"
            @drop="$emit('drop', $event)"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

import type { OrganizationNodeViewModel } from '@/client';

interface IProps {
  node: OrganizationNodeViewModel;
  depth: number;
  expandedNodes?: Set<string>;
  searchQuery?: string;
  dragOverNodeId?: string | null;
}

interface IEmits {
  (event: 'edit', node: OrganizationNodeViewModel): void;
  (event: 'delete', node: OrganizationNodeViewModel): void;
  (event: 'add-child', node: OrganizationNodeViewModel): void;
  (event: 'toggle-expand', nodeId: string): void;
  (event: 'drag-start', node: OrganizationNodeViewModel): void;
  (event: 'drag-over', node: OrganizationNodeViewModel): void;
  (event: 'drag-leave'): void;
  (event: 'drop', node: OrganizationNodeViewModel): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const hasChildren = computed(() => {
  return !!(props.node.children && props.node.children.length > 0);
});

const childrenCount = computed(() => {
  return props.node.children?.length || 0;
});

const isExpanded = computed(() => {
  return props.node.ID ? props.expandedNodes?.has(props.node.ID) : false;
});

const isHighlighted = computed(() => {
  if (!props.searchQuery) return false;
  const query = props.searchQuery.toLowerCase();
  return (
    props.node.title?.toLowerCase().includes(query) ||
    props.node.MemberName?.toLowerCase().includes(query) ||
    props.node.TitleName?.toLowerCase().includes(query) ||
    props.node.Name?.toLowerCase().includes(query)
  );
});

const isDragOver = computed(() => {
  return props.node.ID === props.dragOverNodeId;
});

const handleToggleExpand = () => {
  if (props.node.ID) {
    emit('toggle-expand', props.node.ID);
  }
};

const handleEdit = () => {
  emit('edit', props.node);
};

const handleDelete = () => {
  emit('delete', props.node);
};

const handleAddChild = () => {
  emit('add-child', props.node);
};

// Drag & Drop handlers
const onDragStart = (event: DragEvent) => {
  event.stopPropagation();
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', props.node.ID || '');
  }
  emit('drag-start', props.node);
};

const onDragOver = (event: DragEvent) => {
  event.stopPropagation();
  emit('drag-over', props.node);
};

const onDragLeave = (event: DragEvent) => {
  event.stopPropagation();
  emit('drag-leave');
};

const onDrop = (event: DragEvent) => {
  event.stopPropagation();
  emit('drop', props.node);
};
</script>

<style scoped lang="scss">
.organization-node {
  @apply relative;

  &.highlighted {
    .node-card {
      @apply ring-2 ring-blue-400 ring-opacity-50;

      > div {
        @apply bg-blue-50;
      }
    }
  }

  &.drag-over {
    .node-card {
      @apply ring-2 ring-green-500 ring-opacity-70;

      > div {
        @apply bg-green-50;
      }
    }
  }
}

.node-card {
  @apply transition-all duration-200;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.children-container {
  @apply ml-6;
}

// Expand/Collapse Animation
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 5000px;
  transform: translateY(0);
}
</style>
