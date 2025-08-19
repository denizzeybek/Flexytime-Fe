import { EStorageKeys } from '@/constants/storageKeys';
import { useAuthStore } from '@/stores/auth';
import { useCommonUsersStore } from '@/stores/common/users';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { ERouteNames } from './routeNames.enum';
import { useLogout } from '@/composables/useLogout';
import routes from './routes';
import { useProfileStore } from '@/stores/profile/profile';
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GUARD
let isRefreshing = false;
router.beforeEach(async (to, _, next) => {
  const usersStore = useCommonUsersStore();
  const profileStore = useProfileStore();
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth === true;
  const requiresUnAuth = to.meta.requiresAuth === false;

  let token = localStorage.getItem(EStorageKeys.TOKEN);
  const hasToken = !!token;

  const { logout } = useLogout();

  if (requiresAuth) {
    if (!hasToken) {
      return next({ name: ERouteNames.Login });
    }

    if (!usersStore.isAuthenticated && !isRefreshing) {
      isRefreshing = true;

      try {
        // await profileStore.filter();
        isRefreshing = false;
        return next(); // refresh başarılı
      } catch (err) {
        isRefreshing = false;
        return logout();
      }
    }

    return next(); // token var ve user bilgisi güncel
  }

  if (requiresUnAuth && hasToken) {
    return next(false); // hiçbir yere yönlendirme, mevcut sayfada kal
  }

  return next(); // public veya özel durum olmayan route'lar
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
