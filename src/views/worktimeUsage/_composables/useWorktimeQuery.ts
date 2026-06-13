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
    const fallback = todayUtcWindow();
    return {
      view: (route.query.view as ViewMode) || 'team',
      tab: (route.query.tab as TabType) || getDefaultTab((route.query.view as ViewMode) || 'team'),
      teamId: route.query.teamId as string | null | undefined,
      memberId: route.query.memberId as string | null | undefined,
      startDate: (route.query.startDate as string) || fallback.startDate,
      endDate: (route.query.endDate as string) || fallback.endDate,
      perspective: (route.query.perspective as string) || '0',
    };
  });

  /**
   * Get default tab based on view mode
   */
  const getDefaultTab = (view: ViewMode): TabType => {
    if (view === 'individual') {
      return 'distribution';
    }
    return 'productivity';
  };

  /**
   * Default window = "today UTC, single day", expressed as
   * `start = today 00:00 UTC` (inclusive) and `end = tomorrow 00:00 UTC`
   * (exclusive). Returning ISO strings keeps the URL query stable
   * (`?startDate=...&endDate=...`) and matches the BE contract verbatim.
   */
  const todayUtcWindow = (): { startDate: string; endDate: string } => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
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
   * @param memberId - Member ID or null (backend will use auth token to get current user)
   */
  const navigateToIndividual = async (memberId: string | null) => {
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
   * Update the date-range window. Both args are ISO 8601 strings; `endDate`
   * is exclusive (start of the day AFTER the user-selected end).
   */
  const updateDateRange = async (startDate: string, endDate: string) => {
    await updateQuery({ startDate, endDate });
  };

  /**
   * Update perspective
   */
  const updatePerspective = async (perspective: string) => {
    await updateQuery({ perspective });
  };

  return {
    currentQuery,

    updateQuery,
    navigateToTeam,
    navigateToEmployees,
    navigateToIndividual,
    changeTab,
    updateDateRange,
    updatePerspective,
    getDefaultTab,
    todayUtcWindow,
  };
}
