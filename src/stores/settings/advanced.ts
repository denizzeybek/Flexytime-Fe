import { defineStore } from 'pinia';

import { SettingApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { AdvancedPermissonViewModel, AdvancedSettingModifyModel } from '@/client';

interface State {
  list: AdvancedPermissonViewModel[];
  totalItems: number;
}

export const useSettingsAdvancedsStore = defineStore(EStoreNames.SETTINGS_ADVANCED, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    async filter() {
      const data = await SettingApiService.settingApiAdvancedPermissions();

      this.list = data;
      this.totalItems = data.length;

      return data;
    },
    async save(payload: AdvancedSettingModifyModel[]) {
      return await SettingApiService.settingApiSaveAdvancedPermissions(payload);
    },
  },
});
