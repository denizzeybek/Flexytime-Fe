import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { OpenAPI } from '@/client';
import { useLogout } from '@/composables/useLogout';
import { EStorageKeys } from '@/constants/storageKeys';
import { useAuthStore } from '@/stores/auth';
import { useCommonUsersStore } from '@/stores/common/users';

import { ERouteNames } from './routeNames.enum';
import routes from './routes';
// import { useProfileStore } from '@/stores/profile/profile';
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GUARD
let isRefreshing = false;
router.beforeEach(async (to, from, next) => {
  const usersStore = useCommonUsersStore();
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth === true;
  const requiresUnAuth = to.meta.requiresAuth === false;

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

        // TODO: Fetch user profile here if needed
        // await authStore.getProfile({});

        isRefreshing = false;
        return next(); // refresh successful
      } catch (err) {
        console.error('Token refresh failed:', err);
        isRefreshing = false;
        return logout();
      }
    }

    return next(); // token valid and user authenticated
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
