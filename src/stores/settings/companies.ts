import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type { ICompany } from '@/interfaces/settings/company';

interface State {
  list: ICompany[];
  totalItems: number;
}

export const useSettingsCompaniesStore = defineStore(EStoreNames.SETTINGS_COMPANIES, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    filter() {
      const api = '/webapi/setting/companies';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const companies = useMockData ? response[api] : (response as ICompany);

            this.list = companies;
            this.totalItems = companies?.length || 0;

            resolve(companies);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
