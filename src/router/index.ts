import { EStorageKeys } from '@/constants/storageKeys'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ERouteNames } from './routeNames.enum'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARD
router.beforeEach(async (to, _, next) => {
  const usersStore = useUsersStore()
  const authStore = useAuthStore()
  let token = localStorage.getItem(EStorageKeys.AUTHENTICATION)
  const { requiresAuth, requiresUnAuth, isPublic } = to.meta

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

  next()
})

// SET PAGE TITLE
const DEFAULT_TITLE = 'FlexyTime'
router.afterEach((to) => {
  nextTick(() => {
    document.title =
      typeof to.meta.title === 'string' ? `${to.meta.title} - FlexyTime` : DEFAULT_TITLE
  })
})

router.onError((error) => {
  console.error('router error: ', error)
})

export default router
