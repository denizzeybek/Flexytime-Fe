import { defineStore } from 'pinia';

import { DefinitionService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { AnnualDto, DefinitionMemberViewModel } from '@/client';

interface State {
  activeList: AnnualDto[];
  passiveList: AnnualDto[];
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
        const data = await DefinitionService.definitionControllerAnnuals();

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
    async save(payload: AnnualDto) {
      await DefinitionService.definitionControllerSaveAnnual(payload);
      await this.filter();
    },
    async delete(ID: { ID: string }) {
      await DefinitionService.definitionControllerDeleteAnnual(ID);
      await this.filter();
    },
  },
});
