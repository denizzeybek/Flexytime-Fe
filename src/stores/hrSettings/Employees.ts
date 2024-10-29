import type { IEmployeeMember, IEmployee } from '@/interfaces/hrSettings/employee';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';

interface State {
  list: IEmployeeMember[];
  totalItems: number;
}

export const useHRSettingsEmployeesStore = defineStore(EStoreNames.HR_SETTINGS_EMPLOYEES, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    filter() {
      const api = '/webapi/definition/employees';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const members = useMockData ? response[api] : (response as IEmployee).Members;

            this.list = members;
            this.totalItems = members?.length || 0;

            resolve(members);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
