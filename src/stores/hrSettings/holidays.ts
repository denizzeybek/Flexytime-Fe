import type { IHoliday } from '@/interfaces/hrSettings/holiday';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';

interface State {
  list: IHoliday[];
  totalItems: number;
}

export const useHRSettingsHolidaysStore = defineStore(EStoreNames.HR_SETTINGS_HOLIDAYS, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    filter() {
      const api = '/webapi/company/holidays';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const data = useMockData ? response[api] : (response as IHoliday);

            this.list = data;

            this.totalItems = data?.length || 0;

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
