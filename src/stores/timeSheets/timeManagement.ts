import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
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
      dateRange: []
    }),
    actions: {
      filterPerson(dateRange: string[]) {
        const api = '/webapi/timesheet/week/person';
        this.dateRange = dateRange;
        return new Promise((resolve, reject) => {
          const url = useMockData ? '/mockData.json' : api;

          axios
            .post(url)
            .then((response: any) => {
              const timeManagement = useMockData ? response[api] : (response as ITimeManagement);

              this.personList = timeManagement;
              this.personTotalItems = timeManagement?.length || 0;

              resolve(timeManagement);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      filterProject() {
        const api = '/webapi/timesheet/week/project';
        return new Promise((resolve, reject) => {
          const url = useMockData ? '/mockData.json' : api;

          axios
            .post(url)
            .then((response: any) => {
              const timeManagement = useMockData ? response[api] : (response as ITimeManagement);

              this.projectList = timeManagement;
              this.projectTotalItems = timeManagement?.length || 0;

              resolve(timeManagement);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    },
  },
);
