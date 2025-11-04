import { defineStore } from 'pinia';

import axios from 'axios';

import { EStoreNames } from '@/stores/storeNames.enum';

import type { IPermission } from '@/interfaces/settings/permission';

interface State {
  list: IPermission[];
  totalItems: number;
}

export const useSettingsPermissionsStore = defineStore(EStoreNames.SETTINGS_PERMISSIONS, {
  state: (): State => ({
    list: [],
    totalItems: 0,
  }),
  actions: {
    async filter() {
      const url = '/webapi/setting/permissions';
      const response = await axios.get<IPermission[]>(url);

      this.list = response.data as IPermission[];
      this.totalItems = this.list?.length || 0;

      return response.data;
    },
    async save(payload) {
      const url = '/webapi/setting/permission/save';
      return await axios.post<IPermission>(url, payload);
    },
  },
});
