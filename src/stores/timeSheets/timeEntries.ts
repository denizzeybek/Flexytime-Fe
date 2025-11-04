import { defineStore } from 'pinia';

import axios from 'axios';

import { useMockData } from '@/config';
import { EStoreNames } from '@/stores/storeNames.enum';

interface State {
  manualTimeEntries: any[];
  unclassifiedTimeEntries: any[];
}

export const useTimesheetsTimeEntriesStore = defineStore(EStoreNames.TIMESHEETS_TIME_ENTIES, {
  state: (): State => ({
    manualTimeEntries: [],
    unclassifiedTimeEntries: [],
  }),
  actions: {
    addManualTimeEntries(manualTimeEntries: any) {
      this.manualTimeEntries = [manualTimeEntries, ...this.manualTimeEntries];
    },
    fetchManualTimeEntries() {
      const api = '/webapi/timeEntries/manual';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const timeEntries = useMockData ? response[api] : (response as any);
            this.manualTimeEntries = timeEntries;
            resolve(timeEntries);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchUnclassifiedTimeEntries() {
      const api = '/webapi/timesheet/clocks';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const timeEntries = useMockData ? response[api] : (response as any);
            this.unclassifiedTimeEntries = timeEntries;
            resolve(timeEntries);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
