import { defineStore } from 'pinia';

import { SettingApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { CompanyViewModel } from '@/client';

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
    /**
     * Get companies list
     */
    getList: (state): CompanyViewModel[] => state.list,

    /**
     * Get total items count
     */
    getTotalItems: (state): number => state.totalItems,

    /**
     * Check if loading
     */
    isLoading: (state): boolean => state.loading,

    /**
     * Get error message
     */
    getError: (state): string | null => state.error,
  },

  actions: {
    /**
     * Fetch companies list
     * Endpoint: /webapi/setting/companies
     *
     * @param payload - Request payload (optional filters)
     * @param force - Force refresh even if same request exists
     */
    async filter(): Promise<CompanyViewModel[] | null> {
      try {
        this.loading = true;
        this.error = null;

        const data = await SettingApiService.settingApiCompanies();

        this.list = data;
        this.totalItems = data.length;

        return data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Failed to fetch companies';
        console.error('Error fetching companies:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear companies data and cache
     */
    clearData() {
      this.list = [];
      this.totalItems = 0;
      this.error = null;
    },

    /**
     * Reset store to initial state
     */
    resetStore() {
      this.list = [];
      this.totalItems = 0;
      this.loading = false;
      this.error = null;
    },
  },
});
