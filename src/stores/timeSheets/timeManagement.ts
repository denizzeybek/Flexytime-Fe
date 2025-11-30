import { defineStore } from 'pinia';

import axios from 'axios';

import { EStoreNames } from '@/stores/storeNames.enum';

import type { ITimeManagement } from '@/interfaces/timeSheet/timeManagement';

interface State {
  personList: ITimeManagement[];
  projectList: ITimeManagement[];
  personTotalItems: number;
  projectTotalItems: number;
  dateRange: string[];
}

export const useTimesheetsTimeManagementsStore = defineStore(
  EStoreNames.TIMESHEETS_TIME_MANAGEMENTS,
  {
    state: (): State => ({
      personList: [],
      projectList: [],
      personTotalItems: 0,
      projectTotalItems: 0,
      dateRange: [],
    }),
    actions: {
      filterPerson(dateRange: string[]) {
        const api = '/webapi/timesheet/week/person';
        this.dateRange = dateRange;
        return new Promise((resolve, reject) => {
          axios
            .post(api)
            .then((response: any) => {
              const timeManagement = response as ITimeManagement[];

              this.personList = timeManagement;
              this.personTotalItems = timeManagement?.length || 0;

              resolve(timeManagement);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      filterProject(dateRange: string[]) {
        const api = '/webapi/timesheet/week/project';
        this.dateRange = dateRange;
        return new Promise((resolve, reject) => {
          axios
            .post(api)
            .then((response: any) => {
              const timeManagement = response as ITimeManagement[];

              this.projectList = timeManagement;
              this.projectTotalItems = timeManagement?.length || 0;

              resolve(timeManagement);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      setDate(dateRange: string[]) {
        this.dateRange = dateRange;
      },
    },
  },
);
