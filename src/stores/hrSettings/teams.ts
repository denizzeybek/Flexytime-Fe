import { defineStore } from 'pinia';

import { CompanyService, DefinitionService } from '@/client';
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
  IsDefault?: boolean;
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

        const teams = await CompanyService.companyControllerTeams();

        if (employeesStore.list.length === 0) {
          await employeesStore.filter();
        }

        const teamMemberCounts = new Map<string, number>();
        const teamManagers = new Map<string, TeamManager>();

        employeesStore.list.forEach((employee) => {
          if (employee.TeamId) {
            const count = teamMemberCounts.get(employee.TeamId) || 0;
            teamMemberCounts.set(employee.TeamId, count + 1);

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
          IsDefault: team.IsDefault,
        }));

        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async saveTeam(payload: { ID?: string; Name: string }) {
      await CompanyService.companyControllerSaveTeam(payload);
      await this.fetchTeams();
    },
    async deleteTeam(id: string) {
      await CompanyService.companyControllerDeleteTeam({ ID: id });
      await this.fetchTeams();
    },
    async assignManager(teamId: string, managerId: string | null) {
      const employeesStore = useHRSettingsEmployeesStore();

      const currentManager = employeesStore.list.find(
        (emp) => emp.TeamId === teamId && emp.Role === 1,
      );

      if (currentManager && currentManager.ID !== managerId) {
        await DefinitionService.definitionControllerSaveEmployee({
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

      if (managerId) {
        const newManager = employeesStore.list.find((emp) => emp.ID === managerId);
        if (newManager) {
          await DefinitionService.definitionControllerSaveEmployee({
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

      await employeesStore.filter();
      await this.fetchTeams();
    },
  },
});
