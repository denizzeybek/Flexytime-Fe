import { defineStore } from 'pinia';

import { EStoreNames } from '@/stores/storeNames.enum';

import { useHRSettingsEmployeesStore } from './Employees';

export interface TeamListItem {
  ID?: string;
  Name: string;
  MemberCount?: number;
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

        // Ensure employees data is loaded
        if (employeesStore.teams.length === 0) {
          await employeesStore.filter();
        }

        // Get teams from employees store and calculate member counts
        const teamMemberCounts = new Map<string, number>();
        employeesStore.list.forEach((employee) => {
          if (employee.TeamId) {
            const count = teamMemberCounts.get(employee.TeamId) || 0;
            teamMemberCounts.set(employee.TeamId, count + 1);
          }
        });

        this.list = employeesStore.teams.map((team) => ({
          ID: team.ID,
          Name: team.Name || '',
          MemberCount: teamMemberCounts.get(team.ID || '') || 0,
        }));

        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async saveTeam(_payload: { ID?: string; Name: string }) {
      // TODO: API endpoint not available yet
      // await CompanyApiService.companyApiSaveTeam(payload);
      // await this.fetchTeams();
      throw new Error('Team save API not available yet');
    },
    async deleteTeam(_id: string) {
      // TODO: API endpoint not available yet
      // await CompanyApiService.companyApiDeleteTeam({ ID: id });
      // await this.fetchTeams();
      throw new Error('Team delete API not available yet');
    },
  },
});
