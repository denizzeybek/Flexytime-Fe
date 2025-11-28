import { defineStore } from 'pinia';

import { CompanyApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { HolidayViewModel, PerformReferenceModel } from '@/client';

interface State {
  list: HolidayViewModel[];
  totalItems: number;
}

export const useHRSettingsHolidaysStore = defineStore(EStoreNames.HR_SETTINGS_HOLIDAYS, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    async filter() {
      const data = await CompanyApiService.companyApiHolidays();
      this.list = data;
      this.totalItems = data?.length || 0;
      return data;
    },
    async save(payload: HolidayViewModel) {
      return await CompanyApiService.companyApiSaveHoliday(payload);
    },
    async delete(ID: PerformReferenceModel) {
      return await CompanyApiService.companyApiDeleteHoliday(ID);
    },
  },
});
