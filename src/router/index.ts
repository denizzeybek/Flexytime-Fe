import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { OpenAPI } from '@/client';
import { useAuthorization } from '@/composables/useAuthorization';
import { useLogout } from '@/composables/useLogout';
import { EStorageKeys } from '@/constants/storageKeys';
import { useAuthStore } from '@/stores/auth';
import { useCommonUsersStore } from '@/stores/common/users';
import { useProfileStore } from '@/stores/profile/profile';

import { ERouteNames } from './routeNames.enum';
import routes from './routes';

/**
 * Find the first accessible route for the current user based on their roles
 * Used for smart redirect when user doesn't have access to requested route
 */
const findFirstAccessibleRoute = (): ERouteNames => {
  const { hasAnyRole } = useAuthorization();

  // Route priority order - check in this order
  const routePriority = [
    { name: ERouteNames.WorktimeUsage, roles: [] }, // All authenticated users can access
    { name: ERouteNames.Timesheets, roles: [] },
    { name: ERouteNames.Classification, roles: [] },
    { name: ERouteNames.Company, roles: [] },
    { name: ERouteNames.HRSettings, roles: [] },
    { name: ERouteNames.Settings, roles: [] },
    { name: ERouteNames.Profile, roles: [] },
  ];

  // Find first route user has access to
  for (const route of routePriority) {
    if (route.roles.length === 0 || hasAnyRole(route.roles)) {
      return route.name;
    }
  }

  // Fallback to WorktimeUsage (no role requirement)
  return ERouteNames.WorktimeUsage;
};
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GUARD
let isRefreshing = false;
let isLoadingProfile = false;
router.beforeEach(async (to, from, next) => {
  const usersStore = useCommonUsersStore();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  const requiresAuth = to.meta.requiresAuth === true;
  const requiresUnAuth = to.meta.requiresAuth === false;
  const requiresRole = to.meta.requiresRole;
  const requiresPermission = to.meta.requiresPermission;

  const token = localStorage.getItem(EStorageKeys.TOKEN);
  const hasToken = !!token;

  const { logout } = useLogout();

  // Set token for OpenAPI if exists in localStorage but not in OpenAPI
  if (hasToken && !OpenAPI.TOKEN) {
    OpenAPI.TOKEN = token;
  }

  if (requiresAuth) {
    if (!hasToken) {
      return next({ name: ERouteNames.Login });
    }

    // Skip token refresh if coming from login page (fresh token)
    const comingFromLogin = from.name === ERouteNames.Login;

    // Refresh token on each protected route access if user not authenticated
    if (!usersStore.isAuthenticated && !isRefreshing && !comingFromLogin) {
      isRefreshing = true;

      try {
        // Refresh access token using auth store
        await authStore.refreshToken();
        isRefreshing = false;
      } catch (err) {
        console.error('Token refresh failed:', err);
        isRefreshing = false;
        return logout();
      }
    }

    // ALWAYS load profile for authenticated routes (needed for role/permission checks)
    const hasProfile = profileStore.GeneralProfile && profileStore.GeneralProfile.Wizard;
    if (!hasProfile && !isLoadingProfile) {
      isLoadingProfile = true;
      try {
        console.log('Loading user profile...');
        await profileStore.filter();
        console.log('Profile loaded. Roles:', profileStore.roles);
        isLoadingProfile = false;
      } catch (err) {
        console.error('Failed to load profile:', err);
        isLoadingProfile = false;
        return logout();
      }
    }

    // Check role requirements
    if (requiresRole && requiresRole.length > 0) {
      const { hasAnyRole } = useAuthorization();
      if (!hasAnyRole(requiresRole)) {
        console.warn(
          `Access denied: User does not have required roles. Required: ${requiresRole.join(', ')}, User has: ${profileStore.roles.join(', ')}`
        );
        // Smart redirect: send user to first accessible route instead of Unauthorized
        const firstAccessibleRoute = findFirstAccessibleRoute();
        console.log(`Redirecting to first accessible route: ${firstAccessibleRoute}`);
        return next({ name: firstAccessibleRoute });
      }
    }

    // Check permission requirements
    if (requiresPermission && requiresPermission.length > 0) {
      const { hasAllPermissions } = useAuthorization();
      if (!hasAllPermissions(requiresPermission)) {
        console.warn(
          `Access denied: User does not have required permissions. Required: ${requiresPermission.join(', ')}`
        );
        // Smart redirect: send user to first accessible route instead of Unauthorized
        const firstAccessibleRoute = findFirstAccessibleRoute();
        console.log(`Redirecting to first accessible route: ${firstAccessibleRoute}`);
        return next({ name: firstAccessibleRoute });
      }
    }

    return next(); // all checks passed
  }

  if (requiresUnAuth && hasToken) {
    return next(false); // stay on current page
  }

  return next(); // public or non-auth routes
});

// if (to.name === ERouteNames.ForgotPassword_Reset) {
//   token = ''
// }

// if (token && !usersStore.user) {
//   try {
//     await usersStore.fetchUser(token)
//   } catch (error: any) {
//     console.log(error)
//   }
// }

// if (requiresAuth && !authStore.isAuth) {
//   return next({ name: ERouteNames.Login, query: { redirect: to.fullPath } })
// } else if (requiresUnAuth && authStore.isAuth) {
//   return next({ name: ERouteNames.WorktimeUsage })
// }

//   next()
// })

// SET PAGE TITLE
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
