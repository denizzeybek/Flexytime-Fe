import { computed, ref, watch } from 'vue';

import { type Command, useUndoRedo } from '@/composables/useUndoRedo';

import type { OrganizationNodeViewModel } from '@/client';

export const useOrganizationChart = () => {
  // State
  const organizationList = ref<OrganizationNodeViewModel[]>([]);
  const originalOrganizationList = ref<OrganizationNodeViewModel[]>([]);
  const searchQuery = ref('');
  const expandedNodes = ref<Set<string>>(new Set());
  const expandAll = ref(false);

  // Dialog State
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

  // Helper Functions
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

  const isDescendant = (parent: OrganizationNodeViewModel, nodeId: string): boolean => {
    if (!parent.children) return false;

    for (const child of parent.children) {
      if (child.ID === nodeId) return true;
      if (isDescendant(child, nodeId)) return true;
    }

    return false;
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

  // Actions
  const toggleExpandAll = () => {
    expandAll.value = !expandAll.value;
    if (expandAll.value) {
      expandAllNodes(organizationList.value);
    } else {
      expandedNodes.value.clear();
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
      _parentId: parentNode.ID,
    } as OrganizationNodeViewModel & { _parentId?: string };
    showEditDialog.value = true;
  };

  const handleEditNode = (node: OrganizationNodeViewModel) => {
    dialogMode.value = 'edit';
    selectedNode.value = JSON.parse(JSON.stringify(node));
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
      const newNode = {
        ...node,
        ID: node.ID || generateTempId(),
      };

      const parentId = (node as OrganizationNodeViewModel & { _parentId?: string })._parentId;

      const command: Command<OrganizationNodeViewModel[]> = {
        execute: () => {
          let result: OrganizationNodeViewModel[];
          if (parentId) {
            result = addChildToNode(organizationList.value, parentId, newNode);
            expandedNodes.value.add(parentId);
          } else {
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
    if (draggedNode.value?.ID && targetNode.ID) {
      if (draggedNode.value.ID === targetNode.ID) {
        dragOverNodeId.value = null;
        return;
      }

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
        let newList = removeNodeById(organizationList.value, draggedNodeCopy.ID);
        newList = addChildToNode(newList, targetNodeId, draggedNodeCopy);
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

  const handleCancel = () => {
    organizationList.value = JSON.parse(JSON.stringify(originalOrganizationList.value));
    searchQuery.value = '';
    expandedNodes.value.clear();
  };

  const setOrganizationList = (list: OrganizationNodeViewModel[]) => {
    organizationList.value = JSON.parse(JSON.stringify(list));
    originalOrganizationList.value = JSON.parse(JSON.stringify(list));
    reset(organizationList.value);
  };

  // Watch for external changes to organizationList and sync with undo/redo
  watch(
    () => currentState.value,
    (newState) => {
      if (JSON.stringify(newState) !== JSON.stringify(organizationList.value)) {
        organizationList.value = JSON.parse(JSON.stringify(newState));
      }
    },
    { deep: true },
  );

  return {
    // State
    organizationList,
    originalOrganizationList,
    searchQuery,
    expandedNodes,
    expandAll,
    filteredOrganizationList,

    // Dialog State
    showEditDialog,
    showDeleteDialog,
    selectedNode,
    nodeToDelete,
    dialogMode,

    // Undo/Redo
    canUndo,
    canRedo,

    // Drag & Drop
    dragOverNodeId,

    // Actions
    toggleExpandAll,
    handleToggleExpand,
    handleAddRootNode,
    handleAddChild,
    handleEditNode,
    handleDeleteNode,
    confirmDelete,
    handleSaveNode,
    handleUndo,
    handleRedo,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCancel,
    setOrganizationList,
  };
};
