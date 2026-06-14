

import { computed } from 'vue';

import { useProfileStore } from '@/stores/profile/profile';

export const useProfile = () => {
  const profileStore = useProfileStore();

  const userName = computed(() => {
    return profileStore.GeneralProfile?.fullname ?? '';
  });

  const userTitle = computed(() => {
    return '';
  });

  const buttonSize = computed(() => {
    return undefined;
  });

  return {
    userName,
    userTitle,
    buttonSize,
  };
};
