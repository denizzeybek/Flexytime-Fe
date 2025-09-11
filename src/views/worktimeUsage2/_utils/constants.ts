import type { PerspectiveOption } from '../_types';

export enum EPerspective {
  TIME = 0,
  COST = 1,
  RATE = 2,
  IN_SHIFT = 3,
}

export const PERSPECTIVE_OPTIONS: PerspectiveOption[] = [
  { name: 'Time', value: EPerspective.TIME, icon: 'pi pi-clock' },
  { name: 'Cost', value: EPerspective.COST, icon: 'pi pi-dollar' },
  { name: 'Rate', value: EPerspective.RATE, icon: 'pi pi-percentage' },
  { name: 'In Shift', value: EPerspective.IN_SHIFT, icon: 'pi pi-wrench' },
];

export const SEVERITY_MAP = {
  success: 'success',
  danger: 'danger',
  warn: 'warn',
  contrast: 'contrast',
  info: 'info',
  primary: 'primary',
  secondary: 'secondary',
} as const;

export const BADGE_CONFIG = {
  work: {
    severity: 'success',
    title: 'Work',
    icon: 'pi pi-wrench',
  },
  meeting: {
    severity: 'warn',
    title: 'Meeting',
    icon: 'pi pi-crown',
  },
  leisure: {
    severity: 'danger',
    title: 'Leisure',
    icon: 'pi pi-calendar-clock',
  },
  unclassified: {
    severity: 'secondary',
    title: 'Unclassified',
    icon: 'pi pi-question',
  },
  starttime: {
    severity: 'info',
    title: 'Start Time',
    icon: 'pi pi-clock',
  },
  endtime: {
    severity: 'primary',
    title: 'End Time',
    icon: 'pi pi-clock',
  },
} as const;

export const CHART_COLORS = {
  backgrounds: [
    '#06b6d4',
    '#FFC165',
    '#6b7280',
    '#10b981',
    '#f472b6',
    '#facc15',
    '#8b5cf6',
    '#ef4444',
    '#14b8a6',
  ],
  hovers: [
    '#22d3ee',
    '#FFD580',
    '#9ca3af',
    '#34d399',
    '#fb7185',
    '#fde047',
    '#c4b5fd',
    '#f87171',
    '#2dd4bf',
  ],
};