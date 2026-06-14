

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { IWorktimeQuery, TabType,ViewMode } from '../_types';

export function useWorktimeQuery() {
  const route = useRoute();
  const router = useRouter();

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

  const getDefaultTab = (view: ViewMode): TabType => {
    if (view === 'individual') {
      return 'distribution';
    }
    return 'productivity';
  };

  const todayUtcWindow = (): { startDate: string; endDate: string } => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

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

  const navigateToTeam = async (teamId: string | null) => {
    await updateQuery({
      view: 'team',
      tab: 'productivity',
      teamId: teamId,
      memberId: null,
    });
  };

  const navigateToEmployees = async () => {
    await updateQuery({
      view: 'employees',
      tab: 'productivity',
      teamId: null,
      memberId: null,
    });
  };

  const navigateToIndividual = async (memberId: string | null) => {
    await updateQuery({
      view: 'individual',
      tab: 'distribution',
      teamId: null,
      memberId: memberId,
    });
  };

  const changeTab = async (tab: TabType) => {
    await updateQuery({ tab });
  };

  const updateDateRange = async (startDate: string, endDate: string) => {
    await updateQuery({ startDate, endDate });
  };

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
