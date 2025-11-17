import { computed } from 'vue';
import { defineStore } from 'pinia';

import axios from 'axios';
import qs from 'qs';

import { WizardApiService } from '@/client';
import { EStorageKeys } from '@/constants/storageKeys';
import { EStoreNames } from '@/stores/storeNames.enum';

import { useUsersStore } from './users';

// OAuth types are not in OpenAPI spec as they're external OAuth2 endpoints
interface LoginModel {
  username: string;
  password: string;
  grant_type: string;
}

interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
}

export const useAuthStore = defineStore(EStoreNames.AUTH, () => {
  const usersStore = useUsersStore();
  const isAuth = computed(() => !!usersStore.user);

  return {
    isAuth,
    setAuth(payload: any) {
      const { authentication, user } = payload;
      usersStore.setUser(payload);
      if (authentication) {
        localStorage.setItem(EStorageKeys.USER, JSON.stringify(payload.user));
      }
      if (user) {
        localStorage.setItem(EStorageKeys.AUTHENTICATION, JSON.stringify(payload.authentication));
      }
    },
    $reset() {
      //   OpenAPI.TOKEN = undefined
      localStorage.removeItem(EStorageKeys.AUTHENTICATION);
    },
    async login(payload: LoginModel) {
      console.log('payload 1 ', payload);
      const response = await axios.post<LoginResponse>('/oauth/token', qs.stringify(payload));
      const { access_token, refresh_token } = response.data;
      localStorage.setItem(EStorageKeys.TOKEN, access_token!);
      localStorage.setItem(EStorageKeys.REFRESH_TOKEN, refresh_token!);
      return response;
    },

    async getProfile(result: any) {
      const languageCode = localStorage.getItem('languageCode');
      if (!languageCode) localStorage.setItem('languageCode', 'en');

      try {
        const response = await WizardApiService.wizardApiGetProfile();
        this.setAuth({ authentication: null, user: response });
        result.user = response;
        return result;
      } catch (error) {
        throw error;
      }
    },
  };
});
