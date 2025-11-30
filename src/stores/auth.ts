import { computed } from 'vue';
import { defineStore } from 'pinia';

import { AccountApiService, OpenAPI, ProfileApiService, WizardApiService } from '@/client';
import { EStorageKeys } from '@/constants/storageKeys';
import { LoginService } from '@/customClient';
import { EStoreNames } from '@/stores/storeNames.enum';

import { useUsersStore } from './users';

import type { AccountRegisterViewModel } from '@/client';
import type { LoginRequest } from '@/customClient';

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
      OpenAPI.TOKEN = undefined;
      localStorage.removeItem(EStorageKeys.AUTHENTICATION);
      localStorage.removeItem(EStorageKeys.TOKEN);
    },
    async login(payload: LoginRequest) {
      const response = await LoginService.login(payload);
      const { access_token: token } = response;

      // Store token
      if (token) {
        localStorage.setItem(EStorageKeys.TOKEN, token);
        OpenAPI.TOKEN = token; // Set for all API requests
      }

      return response;
    },

    async refreshToken() {
      try {
        // Verify and refresh token using profileApiVerifyToken
        const response = await ProfileApiService.profileApiVerifyToken();
        const { Token: token, IsValid } = response;

        if (!IsValid || !token) {
          throw new Error('Token is invalid');
        }

        // Update token (replace with new one)
        localStorage.setItem(EStorageKeys.TOKEN, token);
        OpenAPI.TOKEN = token;
        usersStore.isAuthenticated = true;

        return response;
      } catch (error) {
        // Clear token on error
        localStorage.removeItem(EStorageKeys.TOKEN);
        OpenAPI.TOKEN = undefined;
        usersStore.isAuthenticated = false;
        throw error;
      }
    },

    async getProfile(result: any) {
      const languageCode = localStorage.getItem(EStorageKeys.LANGUAGE);
      if (!languageCode) localStorage.setItem(EStorageKeys.LANGUAGE, 'en');

      try {
        const response = await WizardApiService.wizardApiGetProfile();
        this.setAuth({ authentication: null, user: response });
        result.user = response;
        return result;
      } catch (error) {
        throw error;
      }
    },

    async register(payload: AccountRegisterViewModel) {
      try {
        const response = await AccountApiService.accountApiRegister(payload) as any;

        // V1 logic: After registration, automatically login with AccessKey
        // Backend returns { Status, DTO: { AccessKey, ... } }
        // But OpenAPI spec doesn't include DTO - use runtime check
        if (response.DTO?.AccessKey) {
          await this.loginWithGoogle(response.DTO.AccessKey);
        }

        return response;
      } catch (error) {
        throw error;
      }
    },

    async loginWithGoogle(code: string) {
      try {
        const response = await LoginService.loginWithGoogle(code);
        const { access_token: token } = response;

        // Store token
        if (token) {
          localStorage.setItem(EStorageKeys.TOKEN, token);
          OpenAPI.TOKEN = token; // Set for all API requests
        }

        return response;
      } catch (error) {
        throw error;
      }
    },
  };
});
