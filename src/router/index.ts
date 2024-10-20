import { EStorageKeys } from '@/common/enums/storageKeys.enum'
// import { useAuthStore } from '@/stores/common/auth'
// import { useUsersStore } from '@/stores/common/users'
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
  // const usersStore = useUsersStore()
  // const authStore = useAuthStore()
  let token = localStorage.getItem(EStorageKeys.TOKEN)
  const { requiresAuth, requiresUnAuth, isPublic } = to.meta

  if (to.name === ERouteNames.ForgotPassword_Reset) {
    token = ''
  }

  // if (token && !usersStore.user) {
  //   try {
  //     await usersStore.fetchUser(token)
  //   } catch (error: any) {
  //     console.log(error)
  //   }
  // }

  // if (isPublic) {
  //   return next()
  // }

  // if (requiresAuth && !authStore.isAuth) {
  //   return next({ name: ERouteNames.Login, query: { redirect: to.fullPath } })
  // } else if (requiresUnAuth && authStore.isAuth) {
  //   return next({ name: ERouteNames.Dashboard })
  // }

  next()
})

// SET PAGE TITLE
const DEFAULT_TITLE = 'FlexyTime'
router.afterEach((to) => {
  nextTick(() => {
    document.title = typeof to.meta.title === 'string' ? `${to.meta.title} - FlexyTime` : DEFAULT_TITLE
  })
})

router.onError((error) => {
  console.error('router error: ', error)
})

export default router
