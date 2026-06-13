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

/**
 * `MemberViewModel.Role` on the wire is a numeric enum (0=Employee /
 * 1=Manager / 2=Administrator — `libs/contracts/src/definition.dto.ts:
 * MemberRole`). The legacy contract additionally shipped a localized
 * `RoleName` string the table column reads; the v2 BE deliberately drops
 * that string (i18n is FE — see CLAUDE.md memory). The store resolves it
 * at the projection edge so every component reads `RoleName` directly.
 *
 * The translation keys already exist for the modal tab labels — reuse
 * them so we don't grow a parallel translation table.
 */
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
    /**
     * Resolve `MemberRole` (numeric) → i18n key. Components call this with
     * `vue-i18n.t(...)` for the human label. Returns an empty string for
     * unknown roles so a future enum addition doesn't crash the table.
     */
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
    /**
     * Single-record save (Team Manager / System Admin add, or any edit).
     * Body is the PascalCase `TheMemberModifyDto` shape the BE service
     * actually consumes (`MemberName`, `Email`, `Password`, `Role` etc.).
     * Earlier the modal posted camelCase keys and the BE silently created
     * malformed records with `undefined` fields — verify the shape here.
     */
    async save(payload: TheMemberModifyDto) {
      await DefinitionService.definitionControllerSaveEmployee(payload);
      await this.filter();
    },
    /**
     * Batch invite path (Add → Employee role). Sends the email list to the
     * shared invitation endpoint (`/webapi/setting/invitation/save`) — that
     * mints a Download access key per email and queues the JoinTeam invite
     * mail. The old code path posted to `definition/employee/save` which
     * couldn't parse the `{Emails: [...]}` shape and either failed silently
     * or created garbage. Returns when all emails are queued; refreshes the
     * list so the pending invitations bubble up in the FE state.
     */
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
