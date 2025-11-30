import { defineStore } from 'pinia';

import { DefinitionApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { AnnualViewModel, DefinitionMemberViewModel } from '@/client';

interface State {
  activeList: AnnualViewModel[];
  passiveList: AnnualViewModel[];
  activeTotalItems: number;
  passiveTotalItems: number;
  members: DefinitionMemberViewModel[];
  loading: boolean;
}

export const useHRSettingsAnnualsStore = defineStore(EStoreNames.HR_SETTINGS_ANNUALS, {
  state: (): State => ({
    activeList: [],
    passiveList: [],
    activeTotalItems: 0,
    passiveTotalItems: 0,
    members: [],
    loading: false,
  }),
  getters: {
    isLoading: (state): boolean => state.loading,
  },
  actions: {
    async filter() {
      try {
        this.loading = true;
        const data = await DefinitionApiService.definitionApiAnnuals();

        this.activeList = data.ActiveAnnuals ?? [];
        this.activeTotalItems = data.ActiveAnnuals?.length ?? 0;

        this.passiveList = data.PassedAnnuals ?? [];
        this.passiveTotalItems = data.PassedAnnuals?.length ?? 0;

        this.members = data.Members ?? [];

        return data;
      } finally {
        this.loading = false;
      }
    },
    async save(payload: AnnualViewModel) {
      await DefinitionApiService.definitionApiSaveAnnual(payload);
      await this.filter();
    },
    async delete(ID: { ID: string }) {
      await DefinitionApiService.definitionApiDeleteAnnual(ID);
      await this.filter();
    },
  },
});
