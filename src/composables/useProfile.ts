/**
 * Profile Composable
 * Provides user profile information from store
 */

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';

export const useProfile = () => {
  const { t } = useI18n<{ message: MessageSchema }>();
  const profileStore = useProfileStore();

  const userName = computed(() => {
    return profileStore.GeneralProfile?.Employee?.fullname || t('components.profileMenu.defaultTitle');
  });

  const userTitle = computed(() => {
    const title = profileStore.GeneralProfile?.Employee?.title;
    return title;
  });

  const buttonSize = computed(() => {
    // return userTitle.value ? 'large' : undefined;
    return undefined;
  });

  return {
    userName,
    userTitle,
    buttonSize,
  };
};
