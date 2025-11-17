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
}

export const useHRSettingsAnnualsStore = defineStore(EStoreNames.HR_SETTINGS_ANNUALS, {
  state: (): State => ({
    activeList: [],
    passiveList: [],
    activeTotalItems: 0,
    passiveTotalItems: 0,
    members: []
  }),
  actions: {
    async filter() {
      const data = await DefinitionApiService.definitionApiAnnuals();

      this.activeList = data.ActiveAnnuals ?? [];
      this.activeTotalItems = data.ActiveAnnuals?.length ?? 0;

      this.passiveList = data.PassedAnnuals ?? [];
      this.passiveTotalItems = data.PassedAnnuals?.length ?? 0;

      this.members = data.Members ?? [];

      return data;
    },
    async save(payload: AnnualViewModel) {
      return await DefinitionApiService.definitionApiSaveAnnual(payload);
    },
    async delete(ID: { ID: string }) {
      return await DefinitionApiService.definitionApiDeleteAnnual(ID);
    },
  },
});
