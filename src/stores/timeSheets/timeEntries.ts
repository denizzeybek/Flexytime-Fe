import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';

interface State {
  manualTimeEntries: any[];
}

export const useTimesheetsTimeEntriesStore = defineStore(EStoreNames.TIMESHEETS_TIME_ENTIES, {
  state: (): State => ({
    manualTimeEntries: [],
  }),
  actions: {
    addManualTimeEntries(manualTimeEntries: any) {
      this.manualTimeEntries = [manualTimeEntries, ...this.manualTimeEntries];
    },
    filterManualTimeEntries() {
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
  },
});
