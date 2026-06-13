<template>
  <div class="organization-chart-v2">
    <OrganizationChartV2Toolbar @add-root-node="handleAddRootNode" />

    <Card v-if="isLoading" class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl transition-colors">
      <template #content>
        <div class="flex items-center justify-center py-16">
          <ProgressSpinner />
        </div>
      </template>
    </Card>

    <Card
      v-else-if="nodes.length > 0"
      class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors"
    >
      <template #content>
        <div class="vue-flow-container" style="height: 600px;">
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :default-viewport="{ x: 0, y: 0, zoom: 0.8 }"
            :min-zoom="0.3"
            :max-zoom="1.5"
            :nodes-draggable="false"
            :nodes-connectable="false"
            :selectable="false"
            fit-view-on-init
            class="org-flow"
          >
            <template #node-organization="nodeProps">
              <OrganizationChartV2Node v-bind="nodeProps" />
            </template>

            <Controls position="bottom-right" />

            <MiniMap
              position="bottom-left"
              :pannable="true"
              :zoomable="true"
              class="!bg-surface-secondary !border-border-secondary dark:!border-border-primary"
            />

            <Background :gap="20" :size="1" pattern-color="#e5e7eb" />
          </VueFlow>
        </div>
      </template>
    </Card>

    <Card v-else class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl transition-colors">
      <template #content>
        <div class="flex flex-col items-center justify-center py-16 text-content-tertiary gap-4">
          <i class="pi pi-sitemap text-5xl" />
          <p class="text-lg">{{ t('pages.company.organizationChart.emptyState') }}</p>
          <Button
            :label="t('pages.company.organizationChartV2.buttons.addFirstTeam')"
            icon="pi pi-plus"
            severity="primary"
            @click="handleAddRootNode"
          />
        </div>
      </template>
    </Card>

    <NodeEditDialog
      v-model:visible="showEditDialog"
      :node="selectedNode"
      :mode="dialogMode"
      @save="handleSaveNode"
    />

    <OrganizationChartDeleteDialog
      :visible="showDeleteDialog"
      :node="nodeToDelete"
      @update:visible="showDeleteDialog = $event"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';

import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';

import { useFToast } from '@/composables/useFToast';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';

import NodeEditDialog from '../_components/organizationChart/NodeEditDialog.vue';
import OrganizationChartDeleteDialog from '../_components/organizationChart/OrganizationChartDeleteDialog.vue';
import OrganizationChartV2Node from '../_components/organizationChartV2/OrganizationChartV2Node.vue';
import OrganizationChartV2Toolbar from '../_components/organizationChartV2/OrganizationChartV2Toolbar.vue';
import {
  convertToFlowElements,
  type OrganizationFlowEdge,
  type OrganizationFlowNode,
} from '../_types/organizationChartV2';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

import type { OrganizationNodeViewModel } from '@/client';
import type { MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
const { showErrorMessage } = useFToast();
const store = useCompanyOrganizationChartsStore();

/**
 * Two parallel sources of truth:
 *   apiTreeData — the raw `OrganizationNodeViewModel[]` tree. Mutations
 *                  (add / edit / delete) happen here and `autoSave` POSTs
 *                  this to `/webapi/company/organization/save`.
 *   nodes / edges — the flattened Vue Flow render. Recomputed via
 *                    `convertToFlowElements(apiTreeData)` after each
 *                    mutation so the canvas re-layouts.
 *
 * The page mirrors the v1 `OrganizationChart.vue` mutation pattern but
 * skips the `OrganizationTreeNode` shape (Vue Flow doesn't need it).
 */
const isLoading = ref(false);
const isSaving = ref(false);
const apiTreeData = ref<OrganizationNodeViewModel[]>([]);
const nodes = ref<OrganizationFlowNode[]>([]);
const edges = ref<OrganizationFlowEdge[]>([]);

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedNode = ref<OrganizationNodeViewModel | null>(null);
const nodeToDelete = ref<OrganizationNodeViewModel | null>(null);
const dialogMode = ref<'add' | 'edit'>('add');

const refreshFlow = () => {
  const flowElements = convertToFlowElements(apiTreeData.value);
  nodes.value = flowElements.nodes;
  edges.value = flowElements.edges;
};

const findNodeById = (
  tree: OrganizationNodeViewModel[],
  id: string,
): OrganizationNodeViewModel | null => {
  for (const n of tree) {
    if (n.ID === id) return n;
    if (n.children?.length) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
};

const removeNodeById = (
  tree: OrganizationNodeViewModel[],
  id: string,
): OrganizationNodeViewModel[] => {
  return tree
    .filter((n) => n.ID !== id)
    .map((n) => ({
      ...n,
      children: n.children ? removeNodeById(n.children, id) : [],
    }));
};

/**
 * Update by ID — preserve `children` because NodeEditDialog only edits
 * the displayed fields, not the subtree; without this guard, editing a
 * parent would drop its descendants.
 */
const updateNodeById = (
  tree: OrganizationNodeViewModel[],
  id: string,
  patch: Partial<OrganizationNodeViewModel>,
): OrganizationNodeViewModel[] => {
  return tree.map((n) => {
    if (n.ID === id) {
      return { ...n, ...patch, children: n.children } as OrganizationNodeViewModel;
    }
    if (n.children?.length) {
      return { ...n, children: updateNodeById(n.children, id, patch) };
    }
    return n;
  });
};

const addChildToNode = (
  tree: OrganizationNodeViewModel[],
  parentId: string,
  newNode: OrganizationNodeViewModel,
): OrganizationNodeViewModel[] => {
  return tree.map((n) => {
    if (n.ID === parentId) {
      return { ...n, children: [...(n.children ?? []), newNode] };
    }
    if (n.children?.length) {
      return { ...n, children: addChildToNode(n.children, parentId, newNode) };
    }
    return n;
  });
};

const generateTempId = (): string =>
  `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

/**
 * Node action handlers — exposed to the custom node component via
 * `provide` so the on-hover overlay buttons can reach back into the
 * page's dialog state. Mirrors the v1 `OrganizationTreeItem.vue` ↔
 * `OrganizationChart.vue` injection pattern, but the callback takes a
 * Vue Flow node id (which is the API ID we minted in
 * `convertToFlowElements`) rather than the raw OrganizationTreeNode.
 */
provide('onEdit', (id: string) => {
  const node = findNodeById(apiTreeData.value, id);
  if (!node) return;
  dialogMode.value = 'edit';
  selectedNode.value = node;
  showEditDialog.value = true;
});

provide('onDelete', (id: string) => {
  const node = findNodeById(apiTreeData.value, id);
  if (!node) return;
  nodeToDelete.value = node;
  showDeleteDialog.value = true;
});

provide('onAddChild', (id: string) => {
  dialogMode.value = 'add';
  selectedNode.value = {
    children: [],
    title: '',
    MemberName: '',
    TitleName: '',
    Name: '',
    _parentId: id,
  } as OrganizationNodeViewModel & { _parentId?: string };
  showEditDialog.value = true;
});

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

const autoSave = async () => {
  try {
    isSaving.value = true;
    await store.save({ Nodes: apiTreeData.value });
  } catch (error) {
    showErrorMessage(error as Error);
  } finally {
    isSaving.value = false;
  }
};

const handleSaveNode = (node: OrganizationNodeViewModel) => {
  if (dialogMode.value === 'add') {
    const newNode: OrganizationNodeViewModel = {
      ...node,
      ID: node.ID || generateTempId(),
      children: [],
    };
    const parentId = (node as OrganizationNodeViewModel & { _parentId?: string })._parentId;
    if (parentId) {
      apiTreeData.value = addChildToNode(apiTreeData.value, parentId, newNode);
    } else {
      apiTreeData.value = [...apiTreeData.value, newNode];
    }
  } else if (dialogMode.value === 'edit' && node.ID) {
    apiTreeData.value = updateNodeById(apiTreeData.value, node.ID, node);
  }

  showEditDialog.value = false;
  selectedNode.value = null;
  refreshFlow();
  autoSave();
};

const confirmDelete = () => {
  if (nodeToDelete.value?.ID) {
    apiTreeData.value = removeNodeById(apiTreeData.value, nodeToDelete.value.ID);
    refreshFlow();
    showDeleteDialog.value = false;
    nodeToDelete.value = null;
    autoSave();
  }
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    await store.filter();
    apiTreeData.value = store.list ?? [];
    refreshFlow();
  } catch (error) {
    showErrorMessage(error as Error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.organization-chart-v2 {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vue-flow-container {
  background: linear-gradient(135deg, var(--color-surface-secondary) 0%, var(--color-surface-tertiary) 100%);
  border-radius: 0.5rem;
}

:deep(.vue-flow) {
  background: transparent;
}

:deep(.vue-flow__node) {
  cursor: default;
}

:deep(.vue-flow__edge-path) {
  stroke: var(--color-border-secondary);
  stroke-width: 2;
}

:deep(.vue-flow__controls) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-secondary);
  background: var(--color-surface-primary);
}

:deep(.vue-flow__controls-button) {
  background: var(--color-surface-primary);
  border: none;
  border-bottom: 1px solid var(--color-border-secondary);
  width: 28px;
  height: 28px;
  color: var(--color-content-primary);
  fill: var(--color-content-primary);
}

:deep(.vue-flow__controls-button svg),
:deep(.vue-flow__controls-button svg path) {
  fill: currentColor;
}

:deep(.vue-flow__controls-button:hover) {
  background: var(--color-interactive-hover);
}

:deep(.vue-flow__minimap) {
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
