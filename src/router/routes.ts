import type { RouteRecordRaw } from 'vue-router'
import { ERouteNames } from '@/router/routeNames.enum'
import DefaultLayout from '@/layouts/default/DefaultLayout.vue'
import WorktimeUsage from '@/views/worktimeUsage/_views/WorktimeUsage.vue'
import Classification from '@/views/classification/_views/Classification.vue'
import TimesheetEntry from '@/views/timesheets/_views/TimesheetEntry.vue'
import TimeManagement from '@/views/timesheets/_views/TimeManagement.vue'

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
        name: ERouteNames.WorktimeUsage,
        component: WorktimeUsage
      },
      {
        path: '/classification',
        name: ERouteNames.Classification,
        component: Classification
      },
      {
        path: '/timesheet-entry',
        name: ERouteNames.TimesheetEntry,
        component: TimesheetEntry
      },
      {
        path: '/time-management',
        name: ERouteNames.TimeManagement,
        component: TimeManagement
      }
    ]
  }

  // { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound }
]

export default routes
