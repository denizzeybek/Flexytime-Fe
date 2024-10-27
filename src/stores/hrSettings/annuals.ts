import type { IAnnual, IAnnualDTO } from '@/interfaces/hrSettings/annual';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';

interface State {
  activeList: IAnnual[];
  passiveList: IAnnual[];
  activeTotalItems: number;
  passiveTotalItems: number;
}

export const useHRSettingsAnnualsStore = defineStore(EStoreNames.HR_SETTINGS_ANNUALS, {
  state: (): State => ({
    activeList: [],
    passiveList: [],
    activeTotalItems: 0,
    passiveTotalItems: 0,
  }),
  actions: {
    filter() {
      const api = '/webapi/definition/annuals';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const data = useMockData ? response[api] : (response as IAnnualDTO);

            this.activeList = data.ActiveAnnuals;
            this.activeTotalItems = data.ActiveAnnuals?.length || 0;

            this.passiveList = data.PassedAnnuals;
            this.passiveTotalItems = data.PassedAnnuals?.length || 0;

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
