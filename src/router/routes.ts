import Dashboard from '@/views/home/_views/Home.vue'
import type { RouteRecordRaw } from 'vue-router'
import { ERouteNames } from '@/router/routeNames.enum'
import DefaultLayout from '@/layouts/default/DefaultLayout.vue'

// Not Found Page
// import NotFound from '@/views/NotFound.vue'

const routes: RouteRecordRaw[] = [
  // DEFAULT ROUTES (REQUIRES AUTH)
  {
    path: '',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        alias: '',
        name: ERouteNames.Dashboard,
        component: Dashboard
      },
      
    ]
  },

  // { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound }
]

export default routes
