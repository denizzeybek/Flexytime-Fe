import { defineStore } from 'pinia';

import { CompanyApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { TitleViewModel } from '@/client';

export interface TitleListItem {
  ID?: string;
  Name: string;
  IsSupervisor?: boolean;
}

interface State {
  list: TitleListItem[];
  loading: boolean;
}

export const useHRSettingsTitlesStore = defineStore(EStoreNames.HR_SETTINGS_TITLES, {
  state: (): State => ({
    list: [],
    loading: false,
  }),
  getters: {
    isLoading: (state): boolean => state.loading,
  },
  actions: {
    async fetchTitles() {
      try {
        this.loading = true;
        const data = await CompanyApiService.companyApiTitles();
        this.list = data.map((title) => ({
          ID: title.ID,
          Name: title.Name,
          IsSupervisor: title.IsSupervisor,
        }));
        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async saveTitle(payload: TitleViewModel) {
      await CompanyApiService.companyApiSaveTitle(payload);
      await this.fetchTitles();
    },
    async deleteTitle(id: string) {
      await CompanyApiService.companyApiDeleteTitle({ ID: id });
      await this.fetchTitles();
    },
  },
});
