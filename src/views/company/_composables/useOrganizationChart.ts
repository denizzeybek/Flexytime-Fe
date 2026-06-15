import { onMounted, provide, ref } from 'vue';

import { useFToast } from '@/composables/useFToast';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';
import {
  addChildToNode,
  findNodeById,
  generateTempId,
  removeNodeById,
  stripTempIds,
  updateNodeById,
} from '@/views/company/_helpers/organizationTree';
import {
  convertToFlowElements,
  type OrganizationFlowEdge,
  type OrganizationFlowNode,
} from '@/views/company/_types/organizationChartV2';

import type { OrganizationNodeViewModel } from '@/client';

type NodeWithParent = OrganizationNodeViewModel & { _parentId?: string };

export const useOrganizationChart = () => {
  const { showErrorMessage } = useFToast();
  const store = useCompanyOrganizationChartsStore();

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

  const autoSave = async () => {
    try {
      isSaving.value = true;
      await store.save({ Nodes: stripTempIds(apiTreeData.value) });
      await store.filter();
      apiTreeData.value = store.list ?? [];
      refreshFlow();
    } catch (error) {
      showErrorMessage(error as Error);
    } finally {
      isSaving.value = false;
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

  const handleSaveNode = (node: OrganizationNodeViewModel) => {
    if (dialogMode.value === 'add') {
      const newNode: OrganizationNodeViewModel = {
        ...node,
        ID: node.ID || generateTempId(),
        children: [],
      };
      const parentId = (node as NodeWithParent)._parentId;
      apiTreeData.value = parentId
        ? addChildToNode(apiTreeData.value, parentId, newNode)
        : [...apiTreeData.value, newNode];
    } else if (dialogMode.value === 'edit' && node.ID) {
      apiTreeData.value = updateNodeById(apiTreeData.value, node.ID, node);
    }
    showEditDialog.value = false;
    selectedNode.value = null;
    refreshFlow();
    autoSave();
  };

  const confirmDelete = () => {
    if (!nodeToDelete.value?.ID) return;
    apiTreeData.value = removeNodeById(apiTreeData.value, nodeToDelete.value.ID);
    refreshFlow();
    showDeleteDialog.value = false;
    nodeToDelete.value = null;
    autoSave();
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
    } as NodeWithParent;
    showEditDialog.value = true;
  });

  onMounted(() => {
    fetchData();
  });

  return {
    isLoading,
    nodes,
    edges,
    showEditDialog,
    showDeleteDialog,
    selectedNode,
    nodeToDelete,
    dialogMode,
    handleAddRootNode,
    handleSaveNode,
    confirmDelete,
  };
};
