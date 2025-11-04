import { defineStore } from 'pinia';

import axios from 'axios';

import { EStoreNames } from '@/stores/storeNames.enum';

import type { ICompany } from '@/interfaces/settings/company';

interface State {
  list: ICompany[];
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
    getList: (state): ICompany[] => state.list,

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
    async filter(): Promise<ICompany[] | null> {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.get<ICompany[]>('/webapi/setting/companies');

        this.list = response.data;
        this.totalItems = response.data?.length || 0;

        return response.data;
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
