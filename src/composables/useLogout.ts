import { useRouter } from 'vue-router';

import { resetStores } from '@/plugins/pinia';
import { ERouteNames } from '@/router/routeNames.enum';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    router.push({ name: ERouteNames.Login });
    resetStores();
  };
  return {
    logout,
  };
};
