import { defineStore } from 'pinia';

import { SettingService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { CompanyViewModel } from '@/client';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface State {
  list: CompanyViewModel[];
  totalItems: number;
  loading: boolean;
  error: string | null;
}

export const useSettingsCompaniesStore = defineStore(EStoreNames.SETTINGS_COMPANIES, {
  state: (): State => ({
    list: [],
    totalItems: 0,
    loading: false,
    error: null,
  }),

  getters: {

    getList: (state): CompanyViewModel[] => state.list,

    getTotalItems: (state): number => state.totalItems,

    isLoading: (state): boolean => state.loading,

    getError: (state): string | null => state.error,
  },

  actions: {

    async filter(): Promise<CompanyViewModel[] | null> {
      try {
        this.loading = true;
        this.error = null;

        const data = await SettingService.settingControllerCompanies();

        this.list = data;
        this.totalItems = data.length;

        return data;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        this.error = apiErr?.response?.data?.message || 'Failed to fetch companies';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async save(payload: CompanyViewModel): Promise<boolean> {
      try {
        this.loading = true;
        this.error = null;

        await SettingService.settingControllerSaveCompany(payload);
        await this.filter();

        return true;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        this.error = apiErr?.response?.data?.message || 'Failed to save company';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteCompany(companyID: string): Promise<boolean> {
      try {
        this.loading = true;
        this.error = null;

        await SettingService.settingControllerDeleteCompany({ ID: companyID });
        await this.filter();

        return true;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        this.error = apiErr?.response?.data?.message || 'Failed to delete company';
        return false;
      } finally {
        this.loading = false;
      }
    },

    clearData() {
      this.list = [];
      this.totalItems = 0;
      this.error = null;
    },

    resetStore() {
      this.list = [];
      this.totalItems = 0;
      this.loading = false;
      this.error = null;
    },
  },
});
