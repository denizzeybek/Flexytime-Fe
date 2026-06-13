import { defineStore } from 'pinia';

import { CompanyService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { TitleDto } from '@/client';

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
        const data = await CompanyService.companyControllerTitles();
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
    async saveTitle(payload: TitleDto) {
      await CompanyService.companyControllerSaveTitle(payload);
      await this.fetchTitles();
    },
    async deleteTitle(id: string) {
      await CompanyService.companyControllerDeleteTitle({ ID: id });
      await this.fetchTitles();
    },
  },
});
