import { defineStore } from 'pinia';

import { SettingService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { PermissionModifyViewModel, PermissonViewModel } from '@/client';

interface State {
  list: PermissonViewModel[];
  totalItems: number;
}

export const useSettingsPermissionsStore = defineStore(EStoreNames.SETTINGS_PERMISSIONS, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    async filter() {
      const data = await SettingService.settingControllerPermissions();

      this.list = data;
      this.totalItems = data.length;

      return data;
    },
    async save(payload: PermissionModifyViewModel) {
      return await SettingService.settingControllerSavePermissions(payload);
    },
  },
});
