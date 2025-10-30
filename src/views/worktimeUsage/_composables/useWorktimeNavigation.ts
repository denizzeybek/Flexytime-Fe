/**
 * useWorktimeNavigation Composable
 *
 * Helper functions for navigation within worktime usage
 * Provides click handlers for various navigation scenarios
 */

import { useWorktimeQuery } from './useWorktimeQuery';
import type { INavigationTarget } from '../_types';

export function useWorktimeNavigation() {
  const { navigateToTeam, navigateToIndividual } = useWorktimeQuery();

  /**
   * Handle department/team name click
   * Navigates to that team's view
   */
  const handleTeamClick = (teamId: string) => {
    navigateToTeam(teamId);
  };

  /**
   * Handle supervisor/employee name click
   * Navigates to that person's individual view
   */
  const handleEmployeeClick = (memberId: string) => {
    navigateToIndividual(memberId);
  };

  /**
   * Generic navigation handler based on target
   */
  const handleNavigate = (target: INavigationTarget) => {
    if (target.view === 'team') {
      navigateToTeam(target.id);
    } else if (target.view === 'individual') {
      navigateToIndividual(target.id);
    }
  };

  /**
   * Check if a cell should be clickable
   */
  const isClickableCell = (field: string): boolean => {
    const clickableFields = ['TeamName', 'SuperVisorName', 'EmployeeName', 'Team'];
    return clickableFields.includes(field);
  };

  /**
   * Get navigation target from cell data
   */
  const getNavigationTarget = (field: string, rowData: any): INavigationTarget | null => {
    switch (field) {
      case 'TeamName':
      case 'Team':
        return {
          view: 'team',
          id: rowData.ID || rowData.Team?.MemberUrl,
          name: rowData.TeamName || rowData.Team?.Name,
        };

      case 'SuperVisorName':
      case 'EmployeeName':
        return {
          view: 'individual',
          id: rowData.Supervisor?.MemberUrl || rowData.Employee?.MemberUrl,
          name: rowData.SuperVisorName || rowData.EmployeeName,
        };

      default:
        return null;
    }
  };

  return {
    handleTeamClick,
    handleEmployeeClick,
    handleNavigate,
    isClickableCell,
    getNavigationTarget,
  };
}
