import { computed } from 'vue';
import { defineStore } from 'pinia';

import { AccountService, AuthService, OpenAPI, WizardService } from '@/client';
import { EStorageKeys } from '@/constants/storageKeys';
import { EStoreNames } from '@/stores/storeNames.enum';

import { useUsersStore } from './users';

import type { AccountRegisterDto, GoogleLoginDto, LoginDto } from '@/client';

interface AuthBag {
  authentication?: unknown;
  user?: unknown;
}

interface ProfileResultHolder {
  user?: unknown;
}

export const useAuthStore = defineStore(EStoreNames.AUTH, () => {
  const usersStore = useUsersStore();
  const isAuth = computed(() => !!usersStore.user);

  return {
    isAuth,
    setAuth(payload: AuthBag) {
      const { authentication, user } = payload;
      usersStore.setUser(payload);
      if (authentication) {
        localStorage.setItem(EStorageKeys.USER, JSON.stringify(user));
      }
      if (user) {
        localStorage.setItem(EStorageKeys.AUTHENTICATION, JSON.stringify(authentication));
      }
    },
    $reset() {
      OpenAPI.TOKEN = undefined;
      localStorage.removeItem(EStorageKeys.AUTHENTICATION);
      localStorage.removeItem(EStorageKeys.TOKEN);
    },

    async login(payload: LoginDto) {
      const response = await AuthService.authControllerLogin(payload);
      const { access_token: token } = response;

      if (token) {
        localStorage.setItem(EStorageKeys.TOKEN, token);
        OpenAPI.TOKEN = token;
      }

      return response;
    },

    async refreshToken() {
      try {
        const response = await AuthService.authControllerRefresh();
        const { access_token: token } = response;

        if (!token) throw new Error('Token is invalid');

        localStorage.setItem(EStorageKeys.TOKEN, token);
        OpenAPI.TOKEN = token;
        usersStore.isAuthenticated = true;

        return response;
      } catch (error) {
        localStorage.removeItem(EStorageKeys.TOKEN);
        OpenAPI.TOKEN = undefined;
        usersStore.isAuthenticated = false;
        throw error;
      }
    },

    async getProfile(result: ProfileResultHolder) {
      const languageCode = localStorage.getItem(EStorageKeys.LANGUAGE);
      if (!languageCode) localStorage.setItem(EStorageKeys.LANGUAGE, 'en');

      try {
        const response = await WizardService.wizardControllerGetProfile();
        this.setAuth({ authentication: null, user: response });
        result.user = response;
        return result;
      } catch (error) {
        throw error;
      }
    },

    async register(payload: AccountRegisterDto) {
      try {
        const response = await AccountService.accountControllerRegister(payload);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async loginWithGoogle(payload: GoogleLoginDto) {
      try {
        const response = await AuthService.googleControllerGoogle(payload);
        const { access_token: token } = response;

        if (token) {
          localStorage.setItem(EStorageKeys.TOKEN, token);
          OpenAPI.TOKEN = token;
        }

        return response;
      } catch (error) {
        throw error;
      }
    },
  };
});
