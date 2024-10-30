import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type {IPermission} from '@/interfaces/settings/permission';

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
    filter() {
      const api = '/webapi/setting/permissions';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const permissions = useMockData ? response[api] : (response as IPermission);

            this.list = permissions;
            this.totalItems = permissions?.length || 0;

            resolve(permissions);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
