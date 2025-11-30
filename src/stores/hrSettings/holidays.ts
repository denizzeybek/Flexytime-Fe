import { defineStore } from 'pinia';

import { CompanyApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { HolidayViewModel, PerformReferenceModel } from '@/client';

interface State {
  list: HolidayViewModel[];
  totalItems: number;
  loading: boolean;
}

export const useHRSettingsHolidaysStore = defineStore(EStoreNames.HR_SETTINGS_HOLIDAYS, {
  state: (): State => ({
    list: [],
    totalItems: 0,
    loading: false,
  }),
  getters: {
    isLoading: (state): boolean => state.loading,
  },
  actions: {
    async filter() {
      try {
        this.loading = true;
        const data = await CompanyApiService.companyApiHolidays();
        this.list = data;
        this.totalItems = data?.length || 0;
        return data;
      } finally {
        this.loading = false;
      }
    },
    async save(payload: HolidayViewModel) {
      await CompanyApiService.companyApiSaveHoliday(payload);
      await this.filter();
    },
    async delete(ID: PerformReferenceModel) {
      await CompanyApiService.companyApiDeleteHoliday(ID);
      await this.filter();
    },
  },
});
