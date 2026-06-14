

export type ViewMode = 'team' | 'employees' | 'individual';

export type TabType = 'productivity' | 'wellbeing' | 'distribution' | 'webHistory';

export type DisplayMode = 'team' | 'employees';

export interface IWorktimeQuery {
  view: ViewMode;
  tab: TabType;
  teamId?: string | null;
  memberId?: string | null;

  startDate: string;

  endDate: string;
  perspective: string;
}

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

export interface ITabConfig {
  key: TabType;
  label: string;
  icon?: string;
  visible: boolean;
}

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
