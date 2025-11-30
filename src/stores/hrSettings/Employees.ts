import { defineStore } from 'pinia';

import { DefinitionApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  ClockInvitation,
  DefinitionMemberViewModel,
  TheMemberModifyViewModel,
  TheMemberViewModel,
} from '@/client';

interface State {
  list: TheMemberViewModel[];
  totalItems: number;
  roles: DefinitionMemberViewModel[];
  employeeTitles: DefinitionMemberViewModel[];
  managerTitles: DefinitionMemberViewModel[];
  teams: DefinitionMemberViewModel[];
  tags: any[];
  invitations: ClockInvitation[];
  loading: boolean;
}

export const useHRSettingsEmployeesStore = defineStore(EStoreNames.HR_SETTINGS_EMPLOYEES, {
  state: (): State => ({
    list: [],
    totalItems: 0,
    roles: [],
    employeeTitles: [],
    managerTitles: [],
    teams: [],
    tags: [],
    invitations: [],
    loading: false,
  }),
  getters: {
    isLoading: (state): boolean => state.loading,
  },
  actions: {
    async filter() {
      try {
        this.loading = true;
        const data = await DefinitionApiService.definitionApiEmployees();
        const members = data.Members ?? [];

        this.roles = data.Roles ?? [];
        this.employeeTitles = data.EmployeeTitles ?? [];
        this.managerTitles = data.ManagerTitles ?? [];
        this.teams = data.Teams ?? [];
        const tags = data.Tags ?? {};
        this.tags = Object.entries(tags).map(([key, value]) => ({
          name: key,
          value,
        }));
        this.invitations = data.Invitations ?? [];

        this.list = members;
        this.totalItems = members.length;
        return members;
      } finally {
        this.loading = false;
      }
    },
    async save(payload: TheMemberModifyViewModel) {
      await DefinitionApiService.definitionApiSaveEmployee(payload);
      await this.filter();
    },
    async updateEnabled(id: string, enabled: boolean) {
      const employee = this.list.find((e) => e.ID === id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      await DefinitionApiService.definitionApiSaveEmployee({
        ID: employee.ID,
        MemberName: employee.MemberName ?? '',
        TeamId: employee.TeamId,
        TitleId: employee.TitleId,
        TitleName: employee.TitleName,
        Salary: employee.Salary,
        Email: employee.Email,
        Enabled: enabled,
        Role: employee.Role,
        Tags: employee.Tags,
      });
      await this.filter();
    },
    async deleteEmployee(id: string) {
      await DefinitionApiService.definitionApiDeleteEmployee({ ID: id });
      await this.filter();
    },
  },
});
