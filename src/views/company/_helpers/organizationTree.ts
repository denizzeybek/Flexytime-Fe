import type { OrganizationNodeViewModel } from '@/client';

export const findNodeById = (
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

export const removeNodeById = (
  tree: OrganizationNodeViewModel[],
  id: string,
): OrganizationNodeViewModel[] =>
  tree
    .filter((n) => n.ID !== id)
    .map((n) => ({
      ...n,
      children: n.children ? removeNodeById(n.children, id) : [],
    }));

export const updateNodeById = (
  tree: OrganizationNodeViewModel[],
  id: string,
  patch: Partial<OrganizationNodeViewModel>,
): OrganizationNodeViewModel[] =>
  tree.map((n) => {
    if (n.ID === id) {
      return { ...n, ...patch, children: n.children } as OrganizationNodeViewModel;
    }
    if (n.children?.length) {
      return { ...n, children: updateNodeById(n.children, id, patch) };
    }
    return n;
  });

export const addChildToNode = (
  tree: OrganizationNodeViewModel[],
  parentId: string,
  newNode: OrganizationNodeViewModel,
): OrganizationNodeViewModel[] =>
  tree.map((n) => {
    if (n.ID === parentId) {
      return { ...n, children: [...(n.children ?? []), newNode] };
    }
    if (n.children?.length) {
      return { ...n, children: addChildToNode(n.children, parentId, newNode) };
    }
    return n;
  });

export const stripTempIds = (
  tree: OrganizationNodeViewModel[],
): OrganizationNodeViewModel[] =>
  tree.map((n) => ({
    ...n,
    ID: n.ID?.startsWith('temp_') ? undefined : n.ID,
    children: n.children ? stripTempIds(n.children) : [],
  }));

export const generateTempId = (): string =>
  `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
