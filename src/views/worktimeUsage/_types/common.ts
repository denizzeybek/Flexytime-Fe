/**
 * Common Types and Enums for Worktime Usage V2
 */


/**
 * Main view modes in the application
 */
export type ViewMode = 'team' | 'employees' | 'individual';

/**
 * Tab types available in different views
 */
export type TabType = 'productivity' | 'wellbeing' | 'distribution' | 'webHistory';

/**
 * Toggle state for Team/Employees display in right panel
 */
export type DisplayMode = 'team' | 'employees';


/**
 * URL query parameters structure
 * These parameters persist in URL for state management
 */
export interface IWorktimeQuery {
  view: ViewMode;
  tab: TabType;
  teamId?: string | null;
  memberId?: string | null;
  /** Inclusive start of the date-picker window, as ISO 8601 (start-of-day UTC). */
  startDate: string;
  /** Exclusive end of the date-picker window (start of next day), ISO 8601 UTC. */
  endDate: string;
  perspective: string;
}


/**
 * Navigation target for clickable elements
 */
export interface INavigationTarget {
  view: ViewMode;
  id: string;
  name: string;
}


export interface ILoadingState {
  section: boolean;
  employee: boolean;
}

export interface IErrorState {
  section: string | null;
  employee: string | null;
}


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


export interface ITableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  clickable?: boolean;
}
