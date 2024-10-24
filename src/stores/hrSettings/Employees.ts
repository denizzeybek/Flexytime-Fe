import type { IEmployeeMember, IEmployee } from '@/interfaces/hrSettings/employee';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
interface State {
  list: IEmployeeMember[];
  totalItems: number;
}

export const useHRSettingsEmployeesStore = defineStore(
  EStoreNames.HR_SETTINGS_EMPLOYEES,
  {
    state: (): State => ({
      list: [],
      totalItems: 0,
    }),
    actions: {
      filter() {
        return new Promise((resolve, reject) => {
          axios
            .post('/webapi/definition/employees')
            .then((response) => {
              const { Members } = response as unknown as IEmployee;
              this.list = Members;
              this.totalItems = Members?.length;
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    },
  },
);
