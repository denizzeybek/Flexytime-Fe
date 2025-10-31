import type { IHoliday } from '@/interfaces/hrSettings/holiday';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';

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
    async filter() {
      const url = '/webapi/company/holidays';
      const response = await axios.get<IHoliday[]>(url);

      const data = response.data as IHoliday[];
      this.list = data;
      this.totalItems = data?.length || 0;

      return data;
    },
    async save(payload) {
      const url = '/webapi/company/holiday/save';
      return await axios.post<any>(url, payload);
    },
    async delete(ID: { ID: string }) {
      const url = '/webapi/company/holiday/delete';
      return await axios.post<any>(url, ID);
    },
  },
});
