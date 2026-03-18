import { defineStore } from 'pinia';

import { CompanyApiService, DefinitionApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import { useHRSettingsEmployeesStore } from './Employees';

export interface TeamManager {
  ID: string;
  Name: string;
}

export interface TeamListItem {
  ID?: string;
  Name: string;
  MemberCount?: number;
  Manager?: TeamManager;
}

interface State {
  list: TeamListItem[];
  loading: boolean;
}

export const useHRSettingsTeamsStore = defineStore(EStoreNames.HR_SETTINGS_TEAMS, {
  state: (): State => ({
    list: [],
    loading: false,
  }),
  getters: {
    isLoading: (state): boolean => state.loading,
  },
  actions: {
    async fetchTeams() {
      try {
        this.loading = true;
        const employeesStore = useHRSettingsEmployeesStore();

        // Get teams from API
        const teams = await CompanyApiService.companyApiTeams();

        // Ensure employees data is loaded for member count calculation
        if (employeesStore.list.length === 0) {
          await employeesStore.filter();
        }

        // Calculate member counts and find managers from employees
        const teamMemberCounts = new Map<string, number>();
        const teamManagers = new Map<string, TeamManager>();

        employeesStore.list.forEach((employee) => {
          if (employee.TeamId) {
            // Count members
            const count = teamMemberCounts.get(employee.TeamId) || 0;
            teamMemberCounts.set(employee.TeamId, count + 1);

            // Find manager (Role 1 = Team Manager)
            if (employee.Role === 1 && employee.ID && employee.MemberName) {
              teamManagers.set(employee.TeamId, {
                ID: employee.ID,
                Name: employee.MemberName,
              });
            }
          }
        });

        this.list = teams.map((team) => ({
          ID: team.ID,
          Name: team.Name || '',
          MemberCount: teamMemberCounts.get(team.ID || '') || 0,
          Manager: teamManagers.get(team.ID || ''),
        }));

        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async saveTeam(payload: { ID?: string; Name: string }) {
      await CompanyApiService.companyApiSaveTeam(payload);
      await this.fetchTeams();
    },
    async deleteTeam(id: string) {
      await CompanyApiService.companyApiDeleteTeam({ ID: id });
      await this.fetchTeams();
    },
    async assignManager(teamId: string, managerId: string | null) {
      const employeesStore = useHRSettingsEmployeesStore();

      // If there's an existing manager for this team, demote them to employee (Role 0)
      const currentManager = employeesStore.list.find(
        (emp) => emp.TeamId === teamId && emp.Role === 1,
      );

      if (currentManager && currentManager.ID !== managerId) {
        await DefinitionApiService.definitionApiSaveEmployee({
          ID: currentManager.ID,
          MemberName: currentManager.MemberName ?? '',
          TeamId: currentManager.TeamId,
          TitleId: currentManager.TitleId,
          TitleName: currentManager.TitleName,
          Salary: currentManager.Salary,
          Email: currentManager.Email,
          Enabled: currentManager.Enabled,
          Role: 0, // Demote to employee
          Tags: currentManager.Tags,
        });
      }

      // If a new manager is selected, promote them to Team Manager (Role 1)
      if (managerId) {
        const newManager = employeesStore.list.find((emp) => emp.ID === managerId);
        if (newManager) {
          await DefinitionApiService.definitionApiSaveEmployee({
            ID: newManager.ID,
            MemberName: newManager.MemberName ?? '',
            TeamId: teamId, // Assign to this team
            TitleId: newManager.TitleId,
            TitleName: newManager.TitleName,
            Salary: newManager.Salary,
            Email: newManager.Email,
            Enabled: newManager.Enabled,
            Role: 1, // Promote to Team Manager
            Tags: newManager.Tags,
          });
        }
      }

      // Refresh data
      await employeesStore.filter();
      await this.fetchTeams();
    },
  },
});
