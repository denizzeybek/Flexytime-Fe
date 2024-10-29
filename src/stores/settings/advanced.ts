import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type { IAdvanced } from '@/interfaces/settings/advanced';

interface State {
  list: IAdvanced[];
  totalItems: number;
}

export const useSettingsAdvancedsStore = defineStore(EStoreNames.SETTINGS_ADVANCED, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    filter() {
      const api = '/webapi/setting/advances';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const advanced = useMockData ? response[api] : (response as IAdvanced);

            this.list = advanced;
            this.totalItems = advanced?.length || 0;

            resolve(advanced);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
