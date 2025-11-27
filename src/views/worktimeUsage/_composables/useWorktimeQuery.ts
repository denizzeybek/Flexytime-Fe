/**
 * useWorktimeQuery Composable
 *
 * Manages URL query parameters for worktime usage
 * Handles reading/writing query params and syncing with router
 */

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { IWorktimeQuery, TabType,ViewMode } from '../_types';

export function useWorktimeQuery() {
  const route = useRoute();
  const router = useRouter();

  /**
   * Get current query parameters from URL
   */
  const currentQuery = computed((): IWorktimeQuery => {
    return {
      view: (route.query.view as ViewMode) || 'team',
      tab: (route.query.tab as TabType) || getDefaultTab((route.query.view as ViewMode) || 'team'),
      teamId: route.query.teamId as string | null | undefined,
      memberId: route.query.memberId as string | null | undefined,
      interval: (route.query.interval as string) || getDefaultInterval(),
      perspective: Number(route.query.perspective) || 0,
    };
  });

  /**
   * Get default tab based on view mode
   */
  const getDefaultTab = (view: ViewMode): TabType => {
    if (view === 'individual') {
      // Individual view doesn't have productivity, default to distribution
      return 'distribution';
    }
    // Team and employees views default to productivity
    return 'productivity';
  };

  /**
   * Get default interval (today)
   * Format: DD.MM.YYYY-1 (1 = bugün)
   */
  const getDefaultInterval = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}.${month}.${year}-1`;
  };

  /**
   * Update query parameters
   * Merges with existing query params
   */
  const updateQuery = async (updates: Partial<IWorktimeQuery>) => {
    const newQuery = {
      ...route.query,
      ...updates,
    };

    // Remove null/undefined values
    Object.keys(newQuery).forEach((key) => {
      if (newQuery[key] === null || newQuery[key] === undefined) {
        delete newQuery[key];
      }
    });

    await router.push({
      query: newQuery,
    });
  };

  /**
   * Navigate to team view
   */
  const navigateToTeam = async (teamId: string | null) => {
    await updateQuery({
      view: 'team',
      tab: 'productivity',
      teamId: teamId,
      memberId: null,
    });
  };

  /**
   * Navigate to employees view
   */
  const navigateToEmployees = async () => {
    await updateQuery({
      view: 'employees',
      tab: 'productivity',
      teamId: null,
      memberId: null,
    });
  };

  /**
   * Navigate to individual view
   */
  const navigateToIndividual = async (memberId: string) => {
    await updateQuery({
      view: 'individual',
      tab: 'distribution',
      teamId: null,
      memberId: memberId,
    });
  };

  /**
   * Change active tab
   */
  const changeTab = async (tab: TabType) => {
    await updateQuery({ tab });
  };

  /**
   * Update interval (date range)
   */
  const updateInterval = async (interval: string) => {
    await updateQuery({ interval });
  };

  /**
   * Update perspective
   */
  const updatePerspective = async (perspective: number) => {
    await updateQuery({ perspective });
  };

  return {
    // Computed
    currentQuery,

    // Methods
    updateQuery,
    navigateToTeam,
    navigateToEmployees,
    navigateToIndividual,
    changeTab,
    updateInterval,
    updatePerspective,
    getDefaultTab,
    getDefaultInterval,
  };
}
