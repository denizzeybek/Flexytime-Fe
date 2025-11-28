/**
 * Google OAuth Login Composable
 * Handles Google login flow, callback processing, and role-based redirection
 */

import { ref } from 'vue';
import { useRouter } from 'vue-router';

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

    // Get timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get language code from localStorage (fallback to 'en')
    const languageCode = localStorage.getItem('languageCode') || 'en';

    // Build OAuth URL
    const params = new URLSearchParams({
      lang: languageCode,
      zone: timezone,
      code: '', // Promotion code (empty)
      page: '', // Redirect page (empty, backend will redirect to /login)
    });

    // Redirect to backend Google OAuth endpoint
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
      // Check status
      if (status === '-1') {
        errorMessage.value = 'Google login failed. Please try again.';
        return false;
      }

      if (status !== '0') {
        errorMessage.value = 'Invalid Google login status.';
        return false;
      }

      // Login with Google key
      await authStore.loginWithGoogle(key);

      // Load user profile
      await profileStore.filter();

      // Redirect based on role
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
    // Admin -> Companies
    if (profileStore.isAdmin) {
      router.push({ name: ERouteNames.SettingsCompanies });
      return;
    }

    // HR -> Active Annuals
    if (profileStore.isHR) {
      router.push({ name: ERouteNames.HRSettingsActiveAnnuals });
      return;
    }

    // Employee -> WorktimeUsage (individual view)
    // Backend will redirect to individual view automatically if user is employee
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
