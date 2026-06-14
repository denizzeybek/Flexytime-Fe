import { defineStore } from 'pinia';

import { DefinitionService, SettingService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  ClockInvitation,
  DefinitionMemberViewModel,
  TheMemberModifyDto,
  TheMemberViewModel,
} from '@/client';

interface ITagOption {
  name: string;
  value: string;
}

interface State {
  list: TheMemberViewModel[];
  totalItems: number;
  roles: DefinitionMemberViewModel[];
  employeeTitles: DefinitionMemberViewModel[];
  managerTitles: DefinitionMemberViewModel[];
  teams: DefinitionMemberViewModel[];
  tags: ITagOption[];
  invitations: ClockInvitation[];
  loading: boolean;
}

const ROLE_NAME_BY_VALUE: Record<number, string> = {
  0: 'pages.hrSettings.employees.modal.tab.employee',
  1: 'pages.hrSettings.employees.modal.tab.teamManager',
  2: 'pages.hrSettings.employees.modal.tab.systemAdmin',
};

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

    roleNameKey: () => (role: number | undefined): string =>
      typeof role === 'number' ? ROLE_NAME_BY_VALUE[role] ?? '' : '',
  },
  actions: {
    async filter() {
      try {
        this.loading = true;
        const data = await DefinitionService.definitionControllerEmployees();
        const members = data.Members ?? [];

        this.roles = data.Roles ?? [];
        this.employeeTitles = data.EmployeeTitles ?? [];
        this.managerTitles = data.ManagerTitles ?? [];
        this.teams = data.Teams ?? [];
        const tags = data.Tags ?? {};
        this.tags = Object.entries(tags).map(([key, value]) => ({
          name: key,
          value: String(value),
        }));
        this.invitations = data.Invitations ?? [];

        this.list = members;
        this.totalItems = members.length;
        return members;
      } finally {
        this.loading = false;
      }
    },

    addPendingTag(name: string): ITagOption {
      const trimmed = name.trim();
      if (!trimmed) {
        return { name: '', value: '' };
      }
      const existing = this.tags.find(
        (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (existing) return existing;
      const option: ITagOption = { name: trimmed, value: trimmed };
      this.tags = [...this.tags, option];
      return option;
    },

    async save(payload: TheMemberModifyDto) {
      await DefinitionService.definitionControllerSaveEmployee(payload);
      await this.filter();
    },

    async fetchEmployeeDetail(id: string): Promise<TheMemberViewModel | null> {
      const result = await DefinitionService.definitionControllerGetEmployee({ ID: id });
      const envelope = result as unknown as { Status?: number; DTO?: TheMemberViewModel };
      if (envelope?.Status === 0 && envelope.DTO) return envelope.DTO;
      return null;
    },

    async inviteEmails(emails: string[], optional?: { TeamId?: string; TitleId?: string }) {
      await SettingService.settingControllerSaveInvitation({
        Emails: emails,
        ...(optional?.TeamId !== undefined && { TeamId: optional.TeamId }),
        ...(optional?.TitleId !== undefined && { TitleId: optional.TitleId }),
      });
      await this.filter();
    },
    async updateEnabled(id: string, enabled: boolean) {
      const employee = this.list.find((e) => e.ID === id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      await DefinitionService.definitionControllerSaveEmployee({
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
      await DefinitionService.definitionControllerDeleteEmployee({ ID: id });
      await this.filter();
    },
    async quickAssign(id: string, teamId: string, titleId: string) {
      const employee = this.list.find((e) => e.ID === id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      await DefinitionService.definitionControllerSaveEmployee({
        ID: employee.ID,
        MemberName: employee.MemberName ?? '',
        TeamId: teamId,
        TitleId: titleId,
        TitleName: employee.TitleName,
        Salary: employee.Salary,
        Email: employee.Email,
        Enabled: employee.Enabled,
        Role: employee.Role,
        Tags: employee.Tags,
      });
      await this.filter();
    },
  },
});
