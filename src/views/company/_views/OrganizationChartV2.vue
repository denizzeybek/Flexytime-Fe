<template>
  <div class="organization-chart-v2">
    <!-- Header with search and actions -->
    <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden mb-4">
      <template #content>
        <div class="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div class="flex-1 w-full lg:w-auto">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                :placeholder="t('pages.company.organizationChartV2.search.placeholder')"
                class="w-full"
              />
            </IconField>
          </div>
          <div class="flex gap-2 w-full lg:w-auto flex-wrap">
            <!-- Undo/Redo Controls -->
            <div class="flex gap-1">
              <Button
                v-tooltip.top="t('pages.company.organizationChartV2.buttons.undo')"
                icon="pi pi-undo"
                severity="secondary"
                outlined
                size="small"
                :disabled="!canUndo"
                @click="handleUndo"
              />
              <Button
                v-tooltip.top="t('pages.company.organizationChartV2.buttons.redo')"
                icon="pi pi-redo"
                severity="secondary"
                outlined
                size="small"
                :disabled="!canRedo"
                @click="handleRedo"
              />
            </div>

            <Button
              :label="expandAll ? t('pages.company.organizationChartV2.buttons.collapseAll') : t('pages.company.organizationChartV2.buttons.expandAll')"
              :icon="expandAll ? 'pi pi-minus' : 'pi pi-plus'"
              severity="secondary"
              outlined
              size="small"
              @click="toggleExpandAll"
            />
            <Button
              :label="t('pages.company.organizationChartV2.buttons.addRootTeam')"
              icon="pi pi-plus"
              @click="handleAddRootNode"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Organization Tree -->
    <Card v-if="!isLoading && filteredOrganizationList.length > 0" class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
      <template #content>
        <div class="organization-tree">
          <OrganizationNodeV2
            v-for="node in filteredOrganizationList"
            :key="node.ID"
            :node="node"
            :depth="0"
            :expanded-nodes="expandedNodes"
            :search-query="searchQuery"
            :drag-over-node-id="dragOverNodeId"
            @edit="handleEditNode"
            @delete="handleDeleteNode"
            @add-child="handleAddChild"
            @toggle-expand="handleToggleExpand"
            @drag-start="handleDragStart"
            @drag-over="handleDragOver"
            @drag-leave="handleDragLeave"
            @drop="handleDrop"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3 pt-5 border-t border-gray-100">
          <Button
            :label="t('pages.company.organizationChartV2.buttons.cancel')"
            severity="secondary"
            outlined
            @click="handleCancel"
          />
          <Button
            :label="t('pages.company.organizationChartV2.buttons.save')"
            icon="pi pi-save"
            :loading="isSaving"
            @click="handleSave"
          />
        </div>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-else-if="!isLoading && filteredOrganizationList.length === 0" class="shadow-lg border border-gray-100 rounded-2xl">
      <template #content>
        <div class="text-center py-12">
          <i class="pi pi-sitemap text-6xl text-gray-300 mb-4"></i>
          <p class="text-xl text-gray-600 mb-4">
            {{ searchQuery ? t('pages.company.organizationChartV2.emptyState.noResults') : t('pages.company.organizationChartV2.emptyState.noData') }}
          </p>
          <Button
            v-if="!searchQuery"
            :label="t('pages.company.organizationChartV2.buttons.addFirstTeam')"
            icon="pi pi-plus"
            @click="handleAddRootNode"
          />
        </div>
      </template>
    </Card>

    <!-- Loading State -->
    <Card v-if="isLoading" class="shadow-lg border border-gray-100 rounded-2xl">
      <template #content>
        <div class="text-center py-12">
          <ProgressSpinner />
        </div>
      </template>
    </Card>

    <!-- Edit/Add Dialog -->
    <NodeEditDialog
      v-model:visible="showEditDialog"
      :node="selectedNode"
      :mode="dialogMode"
      @save="handleSaveNode"
    />

    <!-- Delete Confirmation -->
    <Dialog
      v-model:visible="showDeleteDialog"
      :header="t('pages.company.organizationChartV2.deleteDialog.title')"
      :modal="true"
      :closable="true"
      class="w-full max-w-md"
    >
      <div class="flex gap-3 items-start">
        <i class="pi pi-exclamation-triangle text-orange-500 text-2xl"></i>
        <div>
          <p class="mb-2">{{ t('pages.company.organizationChartV2.deleteDialog.message') }}</p>
          <p v-if="nodeToDelete?.title" class="font-semibold">{{ nodeToDelete.title }}</p>
          <p v-if="hasChildren(nodeToDelete)" class="text-sm text-orange-600 mt-2">
            {{ t('pages.company.organizationChartV2.deleteDialog.warningChildren') }}
          </p>
        </div>
      </div>
      <template #footer>
        <Button
          :label="t('pages.company.organizationChartV2.deleteDialog.cancel')"
          severity="secondary"
          outlined
          @click="showDeleteDialog = false"
        />
        <Button
          :label="t('pages.company.organizationChartV2.deleteDialog.confirm')"
          severity="danger"
          @click="confirmDelete"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFToast } from '@/composables/useFToast';
import { type Command,useUndoRedo } from '@/composables/useUndoRedo';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';
import NodeEditDialog from '@/views/company/_components/organizationChart/NodeEditDialog.vue';
import OrganizationNodeV2 from '@/views/company/_components/organizationChart/OrganizationNodeV2.vue';

import type { OrganizationNodeViewModel } from '@/client';

const { t } = useI18n<{ message: MessageSchema }>();

const { showErrorMessage, showSuccessMessage } = useFToast();
const organizationsStore = useCompanyOrganizationChartsStore();

const organizationList = ref<OrganizationNodeViewModel[]>([]);
const originalOrganizationList = ref<OrganizationNodeViewModel[]>([]);
const searchQuery = ref('');
const expandedNodes = ref<Set<string>>(new Set());
const expandAll = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedNode = ref<OrganizationNodeViewModel | null>(null);
const nodeToDelete = ref<OrganizationNodeViewModel | null>(null);
const dialogMode = ref<'add' | 'edit'>('add');

// Undo/Redo
const { currentState, canUndo, canRedo, execute, undo, redo, reset } = useUndoRedo<OrganizationNodeViewModel[]>([]);

// Drag & Drop
const draggedNode = ref<OrganizationNodeViewModel | null>(null);
const dragOverNodeId = ref<string | null>(null);

// Computed
const filteredOrganizationList = computed(() => {
  if (!searchQuery.value) return organizationList.value;
  return filterNodes(organizationList.value, searchQuery.value.toLowerCase());
});

// Methods
const filterNodes = (nodes: OrganizationNodeViewModel[], query: string): OrganizationNodeViewModel[] => {
  const results: OrganizationNodeViewModel[] = [];

  for (const node of nodes) {
    const matchesQuery =
      node.title?.toLowerCase().includes(query) ||
      node.MemberName?.toLowerCase().includes(query) ||
      node.TitleName?.toLowerCase().includes(query) ||
      node.Name?.toLowerCase().includes(query);

    let filteredChildren: OrganizationNodeViewModel[] = [];
    if (node.children && node.children.length > 0) {
      filteredChildren = filterNodes(node.children, query);
    }

    if (matchesQuery || filteredChildren.length > 0) {
      results.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });

      // Auto-expand nodes that match search
      if (node.ID && (matchesQuery || filteredChildren.length > 0)) {
        expandedNodes.value.add(node.ID);
      }
    }
  }

  return results;
};

const toggleExpandAll = () => {
  expandAll.value = !expandAll.value;
  if (expandAll.value) {
    expandAllNodes(organizationList.value);
  } else {
    expandedNodes.value.clear();
  }
};

const expandAllNodes = (nodes: OrganizationNodeViewModel[]) => {
  for (const node of nodes) {
    if (node.ID) {
      expandedNodes.value.add(node.ID);
    }
    if (node.children && node.children.length > 0) {
      expandAllNodes(node.children);
    }
  }
};

const handleToggleExpand = (nodeId: string) => {
  if (expandedNodes.value.has(nodeId)) {
    expandedNodes.value.delete(nodeId);
  } else {
    expandedNodes.value.add(nodeId);
  }
};

const handleAddRootNode = () => {
  dialogMode.value = 'add';
  selectedNode.value = {
    children: [],
    title: '',
    MemberName: '',
    TitleName: '',
    Name: '',
  };
  showEditDialog.value = true;
};

const handleAddChild = (parentNode: OrganizationNodeViewModel) => {
  dialogMode.value = 'add';
  selectedNode.value = {
    children: [],
    title: '',
    MemberName: '',
    TitleName: '',
    Name: '',
    _parentId: parentNode.ID, // Temporary field to track parent
  } as OrganizationNodeViewModel & { _parentId?: string };
  showEditDialog.value = true;
};

const handleEditNode = (node: OrganizationNodeViewModel) => {
  dialogMode.value = 'edit';
  selectedNode.value = JSON.parse(JSON.stringify(node)); // Deep clone
  showEditDialog.value = true;
};

const handleDeleteNode = (node: OrganizationNodeViewModel) => {
  nodeToDelete.value = node;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (nodeToDelete.value?.ID) {
    const nodeToDeleteCopy = { ...nodeToDelete.value };
    const previousState = JSON.parse(JSON.stringify(organizationList.value));

    const command: Command<OrganizationNodeViewModel[]> = {
      execute: () => {
        return removeNodeById(organizationList.value, nodeToDeleteCopy.ID!);
      },
      undo: () => {
        return previousState;
      },
      description: `Delete: ${nodeToDeleteCopy.title || 'Untitled'}`,
    };

    organizationList.value = execute(command);
    showDeleteDialog.value = false;
    nodeToDelete.value = null;
  }
};

const handleSaveNode = (node: OrganizationNodeViewModel) => {
  const previousState = JSON.parse(JSON.stringify(organizationList.value));

  if (dialogMode.value === 'add') {
    // Generate a temporary ID for new nodes
    const newNode = {
      ...node,
      ID: node.ID || generateTempId(),
    };

    const parentId = (node as any)._parentId;

    const command: Command<OrganizationNodeViewModel[]> = {
      execute: () => {
        let result: OrganizationNodeViewModel[];
        // Check if it's a child node
        if (parentId) {
          result = addChildToNode(organizationList.value, parentId, newNode);
          expandedNodes.value.add(parentId); // Expand parent
        } else {
          // Root node
          result = [...organizationList.value, newNode];
        }
        return result;
      },
      undo: () => {
        return previousState;
      },
      description: `Add: ${newNode.title || 'Untitled'}`,
    };

    organizationList.value = execute(command);
  } else if (dialogMode.value === 'edit' && node.ID) {
    const command: Command<OrganizationNodeViewModel[]> = {
      execute: () => {
        return updateNodeById(organizationList.value, node.ID!, node);
      },
      undo: () => {
        return previousState;
      },
      description: `Edit: ${node.title || 'Untitled'}`,
    };

    organizationList.value = execute(command);
  }

  showEditDialog.value = false;
  selectedNode.value = null;
};

const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const addChildToNode = (
  nodes: OrganizationNodeViewModel[],
  parentId: string,
  newNode: OrganizationNodeViewModel,
): OrganizationNodeViewModel[] => {
  return nodes.map((node) => {
    if (node.ID === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      };
    }

    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: addChildToNode(node.children, parentId, newNode),
      };
    }

    return node;
  });
};

const updateNodeById = (
  nodes: OrganizationNodeViewModel[],
  targetId: string,
  updatedNode: OrganizationNodeViewModel,
): OrganizationNodeViewModel[] => {
  return nodes.map((node) => {
    if (node.ID === targetId) {
      return {
        ...updatedNode,
        children: node.children, // Preserve children
      };
    }

    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNodeById(node.children, targetId, updatedNode),
      };
    }

    return node;
  });
};

const removeNodeById = (nodes: OrganizationNodeViewModel[], targetId: string): OrganizationNodeViewModel[] => {
  return nodes
    .filter((node) => node.ID !== targetId)
    .map((node) => ({
      ...node,
      children: node.children ? removeNodeById(node.children, targetId) : undefined,
    }));
};

const hasChildren = (node: OrganizationNodeViewModel | null): boolean => {
  return !!(node?.children && node.children.length > 0);
};

// Undo/Redo Handlers
const handleUndo = () => {
  const previousState = undo();
  organizationList.value = JSON.parse(JSON.stringify(previousState));
};

const handleRedo = () => {
  const nextState = redo();
  organizationList.value = JSON.parse(JSON.stringify(nextState));
};

// Drag & Drop Handlers
const handleDragStart = (node: OrganizationNodeViewModel) => {
  draggedNode.value = node;
};

const handleDragOver = (targetNode: OrganizationNodeViewModel) => {
  // Prevent dropping a node onto itself or its descendants
  if (draggedNode.value?.ID && targetNode.ID) {
    if (draggedNode.value.ID === targetNode.ID) {
      dragOverNodeId.value = null;
      return;
    }

    // Check if target is a descendant of dragged node
    if (isDescendant(draggedNode.value, targetNode.ID)) {
      dragOverNodeId.value = null;
      return;
    }

    dragOverNodeId.value = targetNode.ID;
  }
};

const handleDragLeave = () => {
  dragOverNodeId.value = null;
};

const handleDrop = (targetNode: OrganizationNodeViewModel) => {
  if (!draggedNode.value || !draggedNode.value.ID || !targetNode.ID) {
    dragOverNodeId.value = null;
    return;
  }

  // Prevent dropping onto itself or its descendants
  if (draggedNode.value.ID === targetNode.ID || isDescendant(draggedNode.value, targetNode.ID)) {
    dragOverNodeId.value = null;
    draggedNode.value = null;
    return;
  }

  const previousState = JSON.parse(JSON.stringify(organizationList.value));
  const draggedNodeCopy = JSON.parse(JSON.stringify(draggedNode.value));
  const targetNodeId = targetNode.ID;

  const command: Command<OrganizationNodeViewModel[]> = {
    execute: () => {
      // Remove node from its current position
      let newList = removeNodeById(organizationList.value, draggedNodeCopy.ID);

      // Add node as child of target
      newList = addChildToNode(newList, targetNodeId, draggedNodeCopy);

      // Expand the target node
      expandedNodes.value.add(targetNodeId);

      return newList;
    },
    undo: () => {
      return previousState;
    },
    description: `Move: ${draggedNodeCopy.title || 'Untitled'} to ${targetNode.title || 'Untitled'}`,
  };

  organizationList.value = execute(command);

  dragOverNodeId.value = null;
  draggedNode.value = null;
};

const isDescendant = (parent: OrganizationNodeViewModel, nodeId: string): boolean => {
  if (!parent.children) return false;

  for (const child of parent.children) {
    if (child.ID === nodeId) return true;
    if (isDescendant(child, nodeId)) return true;
  }

  return false;
};

const handleSave = async () => {
  try {
    isSaving.value = true;
    const payload = {
      Nodes: organizationList.value,
    };
    await organizationsStore.save(payload);
    showSuccessMessage(t('pages.company.organizationChartV2.messages.saved'));
    await fetchOrganizationChart();
    originalOrganizationList.value = JSON.parse(JSON.stringify(organizationList.value));
  } catch (error) {
    showErrorMessage(error as any);
  } finally {
    isSaving.value = false;
  }
};

const handleCancel = () => {
  organizationList.value = JSON.parse(JSON.stringify(originalOrganizationList.value));
  searchQuery.value = '';
  expandedNodes.value.clear();
};

const fetchOrganizationChart = async () => {
  try {
    isLoading.value = true;
    await organizationsStore.filter();
    organizationList.value = JSON.parse(JSON.stringify(organizationsStore.list));
    originalOrganizationList.value = JSON.parse(JSON.stringify(organizationsStore.list));

    // Reset undo/redo history when fetching new data
    reset(organizationList.value);
  } catch (error) {
    showErrorMessage(error as any);
  } finally {
    isLoading.value = false;
  }
};

// Watch for external changes to organizationList and sync with undo/redo
watch(
  () => currentState.value,
  (newState) => {
    // Only sync if the state actually changed from undo/redo
    if (JSON.stringify(newState) !== JSON.stringify(organizationList.value)) {
      organizationList.value = JSON.parse(JSON.stringify(newState));
    }
  },
  { deep: true },
);

onMounted(() => {
  fetchOrganizationChart();
});
</script>

<style scoped lang="scss">
.organization-chart-v2 {
  @apply space-y-4;
}

.organization-tree {
  @apply space-y-2;
}
</style>
