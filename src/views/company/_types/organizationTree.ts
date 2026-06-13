import type { OrganizationNodeViewModel } from '@/client';

export interface OrganizationTreeNode extends Omit<OrganizationNodeViewModel, 'children'> {
  id: string;
  expanded: boolean;
  children: OrganizationTreeNode[];
}

export const toTreeNode = (node: OrganizationNodeViewModel): OrganizationTreeNode => {
  return {
    ...node,
    id: node.ID || `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    expanded: true,
    children: node.children?.map(toTreeNode) || [],
  };
};

export const fromTreeNode = (node: OrganizationTreeNode): OrganizationNodeViewModel => {
  const { id, children, ...rest } = node;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expanded, ...cleanRest } = rest as OrganizationTreeNode;
  return {
    ...cleanRest,
    ID: id,
    children: children?.map(fromTreeNode) || [],
  };
};

export const toTreeNodes = (nodes: OrganizationNodeViewModel[]): OrganizationTreeNode[] => {
  return nodes.map(toTreeNode);
};

export const fromTreeNodes = (nodes: OrganizationTreeNode[]): OrganizationNodeViewModel[] => {
  return nodes.map(fromTreeNode);
};
