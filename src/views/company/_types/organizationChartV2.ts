import type { OrganizationNodeViewModel } from '@/client';
import type { Edge, Node } from '@vue-flow/core';

/**
 * Custom node data for organization chart
 */
export interface IOrganizationNodeData {
  label: string;
  abbreviation?: string;
  memberName?: string;
  titleName?: string;
}

/**
 * Vue Flow Node type for organization chart
 */
export type OrganizationFlowNode = Node<IOrganizationNodeData>;

/**
 * Vue Flow Edge type for organization chart
 */
export type OrganizationFlowEdge = Edge;

/**
 * Layout configuration
 */
const NODE_WIDTH = 160;
const NODE_HEIGHT = 100;
const HORIZONTAL_SPACING = 40;
const VERTICAL_SPACING = 80;

/**
 * Calculate positions for nodes in a tree layout
 */
const calculateNodePositions = (
  nodes: OrganizationNodeViewModel[],
  parentX: number,
  y: number,
  positions: Map<string, { x: number; y: number }>,
): number => {
  if (nodes.length === 0) return parentX;

  let totalWidth = 0;
  const childWidths: number[] = [];

  // First pass: calculate width needed for each node's subtree
  for (const node of nodes) {
    const childWidth =
      node.children && node.children.length > 0
        ? calculateNodePositions(node.children, 0, y + NODE_HEIGHT + VERTICAL_SPACING, new Map())
        : NODE_WIDTH;
    childWidths.push(childWidth);
    totalWidth += childWidth + HORIZONTAL_SPACING;
  }
  totalWidth -= HORIZONTAL_SPACING; // Remove last spacing

  // Second pass: position nodes
  let currentX = parentX - totalWidth / 2;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nodeId = node.ID || `temp_${i}`;
    const subtreeWidth = childWidths[i];
    const nodeX = currentX + subtreeWidth / 2;

    positions.set(nodeId, { x: nodeX, y });

    // Position children
    if (node.children && node.children.length > 0) {
      calculateNodePositions(node.children, nodeX, y + NODE_HEIGHT + VERTICAL_SPACING, positions);
    }

    currentX += subtreeWidth + HORIZONTAL_SPACING;
  }

  return totalWidth;
};

/**
 * Convert API nodes to Vue Flow nodes and edges
 */
export const convertToFlowElements = (
  apiNodes: OrganizationNodeViewModel[],
): { nodes: OrganizationFlowNode[]; edges: OrganizationFlowEdge[] } => {
  const flowNodes: OrganizationFlowNode[] = [];
  const flowEdges: OrganizationFlowEdge[] = [];
  const positions = new Map<string, { x: number; y: number }>();

  // Calculate positions for all nodes
  calculateNodePositions(apiNodes, 500, 50, positions);

  // Recursive function to process nodes
  const processNode = (node: OrganizationNodeViewModel, parentId?: string) => {
    const nodeId = node.ID || `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const position = positions.get(nodeId) || { x: 0, y: 0 };

    // Create flow node
    flowNodes.push({
      id: nodeId,
      type: 'organization',
      position,
      data: {
        label: node.Name || node.title || 'Untitled',
        abbreviation: node.Abbreviation,
        memberName: node.MemberName || undefined,
        titleName: node.TitleName || undefined,
      },
    });

    // Create edge from parent
    if (parentId) {
      flowEdges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        animated: false,
      });
    }

    // Process children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        processNode(child, nodeId);
      }
    }
  };

  // Process all root nodes
  for (const node of apiNodes) {
    processNode(node);
  }

  return { nodes: flowNodes, edges: flowEdges };
};
