import type {
  IEmployeeMember,
  IEmployee,
  IEmployeeRole,
  IEmployeeTitle,
  IManagerTitle,
  IEmployeeTeam,
  IEmployeeInvitation,
} from '@/interfaces/hrSettings/employee';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';

interface State {
  list: IEmployeeMember[];
  totalItems: number;
  roles: IEmployeeRole[];
  employeeTitles: IEmployeeTitle[];
  managerTitles: IManagerTitle[];
  teams: IEmployeeTeam[];
  tags: any[];
  invitations: IEmployeeInvitation[];
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
  }),
  actions: {
    async filter() {
      const url = '/webapi/definition/employees';
      const response = await axios.get<IEmployee>(url);
      const members = (response.data as IEmployee).Members;

      this.roles = (response.data as IEmployee).Roles;
      this.employeeTitles = (response.data as IEmployee).EmployeeTitles;
      this.managerTitles = (response.data as IEmployee).ManagerTitles;
      this.teams = (response.data as IEmployee).Teams;
      const tags = (response.data as IEmployee).Tags;
      console.log('tags ', tags);
      this.tags = Object.entries(tags).map(([key, value]) => ({
        name: key,
        value,
      }));
      this.invitations = (response.data as IEmployee).Invitations;

      this.list = members;
      this.totalItems = members?.length ?? 0;
      return members;
    },
    async save(payload) {
      const url = '/webapi/definition/employee/save';
      return await axios.post<IEmployee>(url, payload);
    },
  },
});
