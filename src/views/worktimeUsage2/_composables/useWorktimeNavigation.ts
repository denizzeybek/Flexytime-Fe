import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';
import type { FilterPayload, NavigationItem } from '../_types';

export function useWorktimeNavigation() {
  const route = useRoute();
  const router = useRouter();

  const isTeamView = computed(() => route.path.includes('section'));
  const currentPath = computed(() => {
    const path = isTeamView.value 
      ? route.path.split('/clock/section/')[1] 
      : route.path.split('/clock/employee/')[1];
    
    // Handle cases where we're at the root route (will redirect to default)
    if (!path || path === '') {
      return isTeamView.value ? 'productivity-team' : 'distribution';
    }
    
    return path;
  });

  const navigationItems = computed<NavigationItem[]>(() => {
    const baseItems: NavigationItem[] = [
      {
        label: 'Productivity',
        routes: ['productivity-team', 'productivity-individuals'],
        icon: 'pi pi-face-smile',
        routeName: '', // Will be handled by special logic
      },
      {
        label: 'Distribution',
        routes: ['distribution'],
        icon: 'pi pi-chart-pie',
        routeName: isTeamView.value
          ? ERouteNames.WorktimeUsageDistribution
          : ERouteNames.WorktimeUsageDistributionEmployee,
      },
      {
        label: 'Graph',
        routes: ['productivity-graph'],
        icon: 'pi pi-chart-bar',
        routeName: isTeamView.value
          ? ERouteNames.WorktimeUsageProductivityGraph
          : ERouteNames.WorktimeUsageProductivityGraphEmployee,
      },
    ];

    return baseItems;
  });

  const handleNavigation = (item: NavigationItem, viewType?: 'team' | 'individual') => {
    if (item.label === 'Productivity') {
      let routeName: string;
      
      if (isTeamView.value) {
        // Team view: SelectButton'a göre karar ver
        routeName = viewType === 'individual'
          ? ERouteNames.WorktimeUsageProductivityIndividuals
          : ERouteNames.WorktimeUsageProductivityTeam;
      } else {
        // Individual view: Sadece graph var
        routeName = ERouteNames.WorktimeUsageProductivityGraphEmployee;
      }
      
      // Preserve current query parameters
      router.push({ 
        name: routeName, 
        query: route.query 
      });
    } else if (item.routeName) {
      // Preserve current query parameters for other routes too
      router.push({ 
        name: item.routeName, 
        query: route.query 
      });
    }
  };

  const handlePerspectiveChange = (payload: FilterPayload, onTeamFilter: Function, onIndividualFilter: Function) => {
    if (payload.isIndividual) {
      const query = {
        perspective: payload.perspective,
        interval: payload.interval,
        memberId: payload.memberId ?? '',
      };

      const filteredQuery = Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v != null && v !== '')
      );

      router.push({
        name: ERouteNames.WorktimeUsageDistributionEmployee,
        query: filteredQuery,
      });
      
      onIndividualFilter(payload);
    } else {
      const query = {
        perspective: payload.perspective,
        interval: payload.interval,
        teamId: payload.teamId ?? '',
      };

      const filteredQuery = Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v != null && v !== '')
      );

      router.push({ query: filteredQuery });
      onTeamFilter(payload);
    }
  };

  const isNavItemActive = (item: NavigationItem): boolean => {
    return item.routes.includes(currentPath.value);
  };

  return {
    isTeamView,
    currentPath,
    navigationItems,
    handleNavigation,
    handlePerspectiveChange,
    isNavItemActive,
  };
}