/**
 * Profile Composable
 * Provides user profile information from store
 */

import { computed } from 'vue';

import { useProfileStore } from '@/stores/profile/profile';

export const useProfile = () => {
  const profileStore = useProfileStore();

  // v2 ProfileResponseDto ships fullname at the top level; the legacy
  // GeneralProfile.Employee sub-object does not exist in the v2 shape.
  const userName = computed(() => {
    return profileStore.GeneralProfile?.fullname ?? '';
  });

  const userTitle = computed(() => {
    // v2 does not return a job title on the profile endpoint; return empty
    // string so no fabricated label appears in the UI.
    return '';
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
