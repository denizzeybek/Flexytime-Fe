import { defineStore } from 'pinia';

import { EStorageKeys } from '@/constants/storageKeys';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { IProfileUser } from '@/interfaces/profile/profile';

interface State {
  user?: IProfileUser;
  isAuthenticated?: boolean;
}

export const useCommonUsersStore = defineStore(EStoreNames.COMMON_USERS, {
  state: (): State => ({
    user: undefined,
    isAuthenticated: false,
  }),
  actions: {
    setUser(payload: IProfileUser) {
      this.user = payload;
      this.isAuthenticated = payload?.Wizard.Roles?.length ? true : false;
    },
    $reset() {
      this.user = undefined;
      this.isAuthenticated = false;
      localStorage.removeItem(EStorageKeys.USER);
    },
  },
});
