/**
 * Google OAuth Login Composable
 * Handles Google login flow, callback processing, and role-based redirection
 */

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { EStorageKeys } from '@/constants/storageKeys';
import { ERouteNames } from '@/router/routeNames.enum';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile/profile';

export const useGoogleLogin = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  const isProcessing = ref(false);
  const errorMessage = ref<string | null>(null);

  /**
   * Initiate Google OAuth flow
   * Redirects user to backend Google OAuth endpoint
   */
  const initiateGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const languageCode = localStorage.getItem(EStorageKeys.LANGUAGE) || 'en';

    const params = new URLSearchParams({
      lang: languageCode,
      zone: timezone,
      code: '', // Promotion code (empty)
      page: '', // Redirect page (empty, backend will redirect to /login)
    });

    window.location.href = `${API_URL}/account/externallogin?${params.toString()}`;
  };

  /**
   * Handle Google OAuth callback
   * Processes the callback query parameters and logs in the user
   *
   * @param status - Status from query parameter (-1: error, 0: success)
   * @param key - Key from query parameter (used to get token)
   */
  const handleGoogleCallback = async (status: string, key: string): Promise<boolean> => {
    isProcessing.value = true;
    errorMessage.value = null;

    try {
      if (status === '-1') {
        errorMessage.value = 'Google login failed. Please try again.';
        return false;
      }

      if (status !== '0') {
        errorMessage.value = 'Invalid Google login status.';
        return false;
      }

      await authStore.loginWithGoogle({ idToken: key });

      await profileStore.filter();

      redirectAfterLogin();

      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      errorMessage.value = error?.response?.data?.message || 'Google login failed. Please try again.';
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  /**
   * Redirect user after successful login based on their role
   */
  const redirectAfterLogin = () => {
    if (profileStore.isAdmin) {
      router.push({ name: ERouteNames.SettingsCompanies });
      return;
    }

    if (profileStore.isHR) {
      router.push({ name: ERouteNames.HRSettingsActiveAnnuals });
      return;
    }

    router.push({ name: ERouteNames.WorktimeUsage });
  };

  return {
    isProcessing,
    errorMessage,
    initiateGoogleLogin,
    handleGoogleCallback,
    redirectAfterLogin,
  };
};
