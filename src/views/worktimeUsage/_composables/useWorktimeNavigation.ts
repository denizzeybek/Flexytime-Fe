

import { useWorktimeQuery } from './useWorktimeQuery';

import type { INavigationTarget } from '../_types';

export function useWorktimeNavigation() {
  const { navigateToTeam, navigateToIndividual } = useWorktimeQuery();

  const handleTeamClick = (teamId: string) => {
    if (teamId === '__company__') {
      navigateToTeam(null);
      return;
    }
    navigateToTeam(teamId);
  };

  const handleEmployeeClick = (memberId: string) => {
    navigateToIndividual(memberId);
  };

  const handleNavigate = (target: INavigationTarget) => {
    if (target.view === 'team') {
      navigateToTeam(target.id);
    } else if (target.view === 'individual') {
      navigateToIndividual(target.id);
    }
  };

  const isClickableCell = (field: string): boolean => {
    const clickableFields = ['TeamName', 'SuperVisorName', 'EmployeeName', 'Team'];
    return clickableFields.includes(field);
  };

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
