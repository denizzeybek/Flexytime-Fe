/**
 * Common Types and Enums for Worktime Usage V2
 */

// ============================================
// View Mode Types
// ============================================

/**
 * Main view modes in the application
 */
export type ViewMode = 'team' | 'employees' | 'individual';

/**
 * Tab types available in different views
 */
export type TabType = 'productivity' | 'wellbeing' | 'distribution' | 'graph' | 'webHistory';

/**
 * Toggle state for Team/Employees display in right panel
 */
export type DisplayMode = 'team' | 'employees';

// ============================================
// Query Parameter Interface
// ============================================

/**
 * URL query parameters structure
 * These parameters persist in URL for state management
 */
export interface IWorktimeQuery {
  view: ViewMode;
  tab: TabType;
  teamId?: string | null;
  memberId?: string | null;
  interval: string;
  perspective: number;
}

// ============================================
// Navigation Helpers
// ============================================

/**
 * Navigation target for clickable elements
 */
export interface INavigationTarget {
  view: ViewMode;
  id: string;
  name: string;
}

// ============================================
// Loading and Error States
// ============================================

export interface ILoadingState {
  section: boolean;
  employee: boolean;
}

export interface IErrorState {
  section: string | null;
  employee: string | null;
}

// ============================================
// Tab Configuration
// ============================================

/**
 * Configuration for each tab
 */
export interface ITabConfig {
  key: TabType;
  label: string;
  icon?: string;
  visible: boolean;
}

/**
 * View-specific tab configurations
 */
export interface IViewTabConfig {
  team: ITabConfig[];
  employees: ITabConfig[];
  individual: ITabConfig[];
}

// ============================================
// Table Column Definitions
// ============================================

export interface ITableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  clickable?: boolean;
}
