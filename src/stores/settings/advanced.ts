import { defineStore } from 'pinia';

import axios from 'axios';

import { EStoreNames } from '@/stores/storeNames.enum';

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
    async filter() {
      const url = '/webapi/setting/advances';
      const response = await axios.get<IAdvanced[]>(url);

      this.list = response.data as IAdvanced[];
      this.totalItems = this.list?.length || 0;

      return response.data;
    },
    async save(payload) {
      const url = '/webapi/setting/advance/save';
      return await axios.post<IAdvanced>(url, payload);
    },
  },
});
