<template>
  <div class="organization-chart-v2">
    <!-- Header with search and actions -->
    <OrganizationChartToolbar
      :search-query="searchQuery"
      :can-undo="canUndo"
      :expand-all="expandAll"
      @update:search-query="searchQuery = $event"
      @undo="handleUndo"
      @toggle-expand-all="toggleExpandAll"
      @add-root-node="handleAddRootNode"
    />

    <!-- Organization Tree -->
    <Card v-if="!isLoading && treeData.length > 0" class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
      <template #content>
        <div class="organization-tree">
          <VueTreeDnd
            v-model="treeData"
            :component="OrganizationTreeItem"
            @move="handleMove"
          />
        </div>
      </template>
    </Card>

    <!-- Empty State -->
    <OrganizationChartEmptyState
      v-else-if="!isLoading && treeData.length === 0"
      :has-search-query="!!searchQuery"
      @add-root-node="handleAddRootNode"
    />

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
    <OrganizationChartDeleteDialog
      :visible="showDeleteDialog"
      :node="nodeToDelete"
      @update:visible="showDeleteDialog = $event"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue';
import VueTreeDnd from 'vue-tree-dnd';

import { useFToast } from '@/composables/useFToast';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';
import NodeEditDialog from '@/views/company/_components/organizationChart/NodeEditDialog.vue';
import OrganizationChartDeleteDialog from '@/views/company/_components/organizationChart/OrganizationChartDeleteDialog.vue';
import OrganizationChartEmptyState from '@/views/company/_components/organizationChart/OrganizationChartEmptyState.vue';
import OrganizationChartToolbar from '@/views/company/_components/organizationChart/OrganizationChartToolbar.vue';
import OrganizationTreeItem from '@/views/company/_components/organizationChart/OrganizationTreeItem.vue';
import { fromTreeNodes, toTreeNodes } from '@/views/company/_types/organizationTree';

import type { OrganizationNodeViewModel } from '@/client';
import type { OrganizationTreeNode } from '@/views/company/_types/organizationTree';

const { showErrorMessage } = useFToast();
const organizationsStore = useCompanyOrganizationChartsStore();

// Local state
const isLoading = ref(false);
const isSaving = ref(false);
const treeData = ref<OrganizationTreeNode[]>([]);
const originalTreeData = ref<OrganizationTreeNode[]>([]);
const searchQuery = ref('');
const expandAll = ref(true);

// Dialog state
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedNode = ref<OrganizationNodeViewModel | null>(null);
const nodeToDelete = ref<OrganizationNodeViewModel | null>(null);
const dialogMode = ref<'add' | 'edit'>('add');

// Undo state
const history = ref<OrganizationTreeNode[][]>([]);
const historyIndex = ref(-1);

const canUndo = computed(() => historyIndex.value > 0);

// Provide event handlers to tree item component
provide('searchQuery', searchQuery);
provide('onEdit', (node: OrganizationTreeNode) => {
  dialogMode.value = 'edit';
  selectedNode.value = node as unknown as OrganizationNodeViewModel;
  showEditDialog.value = true;
});
provide('onDelete', (node: OrganizationTreeNode) => {
  nodeToDelete.value = node as unknown as OrganizationNodeViewModel;
  showDeleteDialog.value = true;
});
provide('onAddChild', (node: OrganizationTreeNode) => {
  dialogMode.value = 'add';
  selectedNode.value = {
    children: [],
    title: '',
    MemberName: '',
    TitleName: '',
    Name: '',
    _parentId: node.id,
  } as OrganizationNodeViewModel & { _parentId?: string };
  showEditDialog.value = true;
});

// Helper functions
const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const pushToHistory = (state: OrganizationTreeNode[]) => {
  // Remove any future states if we're not at the end
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }
  history.value.push(JSON.parse(JSON.stringify(state)));
  historyIndex.value = history.value.length - 1;
};

const removeNodeById = (nodes: OrganizationTreeNode[], id: string): OrganizationTreeNode[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? removeNodeById(node.children, id) : [],
    }));
};

const addChildToNode = (
  nodes: OrganizationTreeNode[],
  parentId: string,
  newNode: OrganizationTreeNode,
): OrganizationTreeNode[] => {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
        expanded: true,
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
  nodes: OrganizationTreeNode[],
  id: string,
  updatedNode: Partial<OrganizationTreeNode>,
): OrganizationTreeNode[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updatedNode, children: node.children };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNodeById(node.children, id, updatedNode),
      };
    }
    return node;
  });
};

// Auto-save function
const autoSave = async () => {
  try {
    isSaving.value = true;
    const payload = { Nodes: fromTreeNodes(treeData.value) };
    await organizationsStore.save(payload);
    originalTreeData.value = JSON.parse(JSON.stringify(treeData.value));
  } catch (error) {
    showErrorMessage(error as Error);
  } finally {
    isSaving.value = false;
  }
};

// Handle move event from vue-tree-dnd
const handleMove = () => {
  pushToHistory(treeData.value);
  // vue-tree-dnd already updates the v-model, so we just need to save
  autoSave();
};

const toggleExpandAll = () => {
  expandAll.value = !expandAll.value;
  const setExpandedRecursive = (nodes: OrganizationTreeNode[], expanded: boolean): OrganizationTreeNode[] => {
    return nodes.map((node) => ({
      ...node,
      expanded,
      children: node.children ? setExpandedRecursive(node.children, expanded) : [],
    }));
  };
  treeData.value = setExpandedRecursive(treeData.value, expandAll.value);
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

const handleSaveNode = (node: OrganizationNodeViewModel) => {
  pushToHistory(treeData.value);

  if (dialogMode.value === 'add') {
    const newNode: OrganizationTreeNode = {
      ...node,
      id: node.ID || generateTempId(),
      expanded: true,
      children: [],
    };

    const parentId = (node as OrganizationNodeViewModel & { _parentId?: string })._parentId;

    if (parentId) {
      treeData.value = addChildToNode(treeData.value, parentId, newNode);
    } else {
      treeData.value = [...treeData.value, newNode];
    }
  } else if (dialogMode.value === 'edit' && node.ID) {
    treeData.value = updateNodeById(treeData.value, node.ID, {
      ...node,
      id: node.ID,
    } as OrganizationTreeNode);
  }

  showEditDialog.value = false;
  selectedNode.value = null;
  autoSave();
};

const confirmDelete = () => {
  if (nodeToDelete.value?.ID) {
    pushToHistory(treeData.value);
    treeData.value = removeNodeById(treeData.value, nodeToDelete.value.ID);
    showDeleteDialog.value = false;
    nodeToDelete.value = null;
    autoSave();
  }
};

const handleUndo = () => {
  if (canUndo.value) {
    historyIndex.value--;
    treeData.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]));
    autoSave();
  }
};

// API Operations
const fetchOrganizationChart = async () => {
  try {
    isLoading.value = true;
    await organizationsStore.filter();
    treeData.value = toTreeNodes(organizationsStore.list);
    originalTreeData.value = JSON.parse(JSON.stringify(treeData.value));
    pushToHistory(treeData.value);
  } catch (error) {
    showErrorMessage(error as Error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrganizationChart();
});
</script>

<style scoped>
.organization-chart-v2 {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.organization-tree {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

:deep(.vue-tree-dnd) {
  width: 100%;
}

:deep(.vue-tree-dnd-item) {
  width: 100%;
  margin-left: 0 !important;
  padding-left: 0 !important;
}

:deep(.vue-tree-dnd-children) {
  width: 100%;
  margin-left: 0 !important;
  padding-left: 0 !important;
}
</style>
