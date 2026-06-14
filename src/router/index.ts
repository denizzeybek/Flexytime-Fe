import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { OpenAPI } from '@/client';
import { useAuthorization } from '@/composables/useAuthorization';
import { useLogout } from '@/composables/useLogout';
import { EStorageKeys } from '@/constants/storageKeys';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile/profile';
import { useUsersStore } from '@/stores/users';

import { ERouteNames } from './routeNames.enum';
import routes from './routes';

const findFirstAccessibleRoute = (): ERouteNames => {
  const { hasAnyRole } = useAuthorization();

  const routePriority = [
    { name: ERouteNames.WorktimeUsage, roles: [] },
    { name: ERouteNames.Timesheets, roles: [] },
    { name: ERouteNames.Classification, roles: [] },
    { name: ERouteNames.Company, roles: [] },
    { name: ERouteNames.HRSettings, roles: [] },
    { name: ERouteNames.Settings, roles: [] },
    { name: ERouteNames.Profile, roles: [] },
  ];

  for (const route of routePriority) {
    if (route.roles.length === 0 || hasAnyRole(route.roles)) {
      return route.name;
    }
  }

  return ERouteNames.WorktimeUsage;
};
const router = createRouter({
  history: createWebHistory(),
  routes,
});

let isRefreshing = false;
let isLoadingProfile = false;
router.beforeEach(async (to, from, next) => {
  const usersStore = useUsersStore();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  const requiresAuth = to.meta.requiresAuth === true;
  const requiresUnAuth = to.meta.requiresAuth === false;
  const requiresRole = to.meta.requiresRole;
  const requiresPermission = to.meta.requiresPermission;

  const token = localStorage.getItem(EStorageKeys.TOKEN);
  const hasToken = !!token;

  const { logout } = useLogout();

  if (hasToken && !OpenAPI.TOKEN) {
    OpenAPI.TOKEN = token;
  }

  if (requiresAuth) {
    if (!hasToken) {
      return next({ name: ERouteNames.Login });
    }

    const comingFromLogin = from.name === ERouteNames.Login || from.name === ERouteNames.Register;

    if (!usersStore.isAuthenticated && !isRefreshing && !comingFromLogin) {
      isRefreshing = true;

      try {
        await authStore.refreshToken();
        isRefreshing = false;
      } catch (err) {
        console.error('Token refresh failed:', err);
        isRefreshing = false;
        return logout();
      }
    }

    const hasProfile = profileStore.GeneralProfile && profileStore.GeneralProfile.Wizard;
    if (!hasProfile && !isLoadingProfile) {
      isLoadingProfile = true;
      try {
        await profileStore.filter();
        isLoadingProfile = false;
      } catch {
        isLoadingProfile = false;
        return logout();
      }
    }

    if (requiresRole && requiresRole.length > 0) {
      const { hasAnyRole } = useAuthorization();
      if (!hasAnyRole(requiresRole)) {
        const firstAccessibleRoute = findFirstAccessibleRoute();
        return next({ name: firstAccessibleRoute });
      }
    }

    if (requiresPermission && requiresPermission.length > 0) {
      const { hasAllPermissions } = useAuthorization();
      if (!hasAllPermissions(requiresPermission)) {
        const firstAccessibleRoute = findFirstAccessibleRoute();
        return next({ name: firstAccessibleRoute });
      }
    }

    return next();
  }

  if (requiresUnAuth && hasToken) {
    return next(false);
  }

  return next();
});

const DEFAULT_TITLE = 'FlexyTime';
router.afterEach((to) => {
  nextTick(() => {
    document.title =
      typeof to.meta.title === 'string' ? `${to.meta.title} - FlexyTime` : DEFAULT_TITLE;
  });
});

router.onError((error) => {
  console.error('router error: ', error);
});

export default router;
