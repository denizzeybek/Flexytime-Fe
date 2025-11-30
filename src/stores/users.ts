import { defineStore } from 'pinia';

import { EStoreNames } from '@/stores/storeNames.enum';

interface State {
  user?: any;
  authentication?: any;
  profile?: any;
  isAuthenticated: boolean;
}

export const useUsersStore = defineStore(EStoreNames.COMMON_USERS, {
  state: (): State => ({
    user: undefined,
    authentication: undefined,
    profile: undefined,
    isAuthenticated: false,
  }),
  actions: {
    setUser(payload: any) {
      this.authentication = payload?.authentication;
      this.user = payload?.user;
      this.isAuthenticated = !!payload?.user;
    },
    $reset() {
      this.user = undefined;
      this.authentication = undefined;
      this.profile = undefined;
      this.isAuthenticated = false;
    },
  },
});
  