import type { OrganizationNodeViewModel } from '@/client';

// Extended type for vue-tree-dnd compatibility
// vue-tree-dnd requires: id, expanded, children
export interface OrganizationTreeNode extends Omit<OrganizationNodeViewModel, 'children'> {
  id: string;
  expanded: boolean;
  children: OrganizationTreeNode[];
}

// Convert OrganizationNodeViewModel to OrganizationTreeNode
export const toTreeNode = (node: OrganizationNodeViewModel): OrganizationTreeNode => {
  return {
    ...node,
    id: node.ID || `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    expanded: true,
    children: node.children?.map(toTreeNode) || [],
  };
};

// Convert OrganizationTreeNode back to OrganizationNodeViewModel
export const fromTreeNode = (node: OrganizationTreeNode): OrganizationNodeViewModel => {
  // Remove frontend-only fields (id, expanded) and keep only backend fields
  const { id, children, ...rest } = node;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expanded, ...cleanRest } = rest as OrganizationTreeNode;
  return {
    ...cleanRest,
    ID: id,
    children: children?.map(fromTreeNode) || [],
  };
};

// Convert array of nodes
export const toTreeNodes = (nodes: OrganizationNodeViewModel[]): OrganizationTreeNode[] => {
  return nodes.map(toTreeNode);
};

export const fromTreeNodes = (nodes: OrganizationTreeNode[]): OrganizationNodeViewModel[] => {
  return nodes.map(fromTreeNode);
};
