

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

  const initiateGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const languageCode = localStorage.getItem(EStorageKeys.LANGUAGE) || 'en';

    const params = new URLSearchParams({
      lang: languageCode,
      zone: timezone,
      code: '',
      page: '',
    });

    window.location.href = `${API_URL}/account/externallogin?${params.toString()}`;
  };

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
