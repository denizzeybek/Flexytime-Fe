import type { RouteRecordRaw } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';
import DefaultLayout from '@/layouts/default/DefaultLayout.vue';
import WorktimeUsage from '@/views/worktimeUsage/_views/WorktimeUsage.vue';

import Classification from '@/views/classification/_views/Classification.vue';
import ClassificationWebAddresses from '@/views/classification/_views/WebAddresses.vue';
import ClassificationApplications from '@/views/classification/_views/Applications.vue';

import TimesheetEntry from '@/views/timesheets/_views/TimesheetEntry.vue';
import TimeManagement from '@/views/timesheets/_views/TimeManagement.vue';

import Company from '@/views/company/_views/Company.vue';
import OrganizationChart from '@/views/company/_views/OrganizationChart.vue';

// HR Settings
import HRSettings from '@/views/hrSettings/_views/HRSettings.vue';
import Employees from '@/views/hrSettings/_views/Employees.vue';
import Annuals from '@/views/hrSettings/_views/Annuals.vue';
import Holidays from '@/views/hrSettings/_views/Holidays.vue';

import Login from '@/views/auth/Login.vue';
import AnnualsList from '@/views/hrSettings/_components/annuals/AnnualsList.vue';

import AuthLayout from '@/layouts/auth/AuthLayout.vue';
// Not Found Page
// import NotFound from '@/views/NotFound.vue'

const routes: RouteRecordRaw[] = [
  // DEFAULT ROUTES (REQUIRES AUTH)
  {
    path: '',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/',
        alias: '',
        name: ERouteNames.WorktimeUsage,
        component: WorktimeUsage,
        meta: {
          title: ERouteNames.WorktimeUsage,
          name: ERouteNames.WorktimeUsage,
        },
      },
      {
        path: '/classification',
        name: ERouteNames.Classification,
        component: Classification,
        meta: {
          title: ERouteNames.Classification,
          name: ERouteNames.Classification,
        },
        children: [
          {
            path: 'web-addresses',
            name: ERouteNames.ClassificationWebAddresses,
            component: ClassificationWebAddresses,
            meta: {
              title: ERouteNames.ClassificationWebAddresses,
              name: ERouteNames.ClassificationWebAddresses,
            },
          },
          {
            path: 'applications',
            name: ERouteNames.ClassificationApplications,
            component: ClassificationApplications,
            meta: {
              title: ERouteNames.ClassificationApplications,
              name: ERouteNames.ClassificationApplications,
            },
          },
        ],
      },
      {
        path: '/timesheet-entry',
        name: ERouteNames.TimesheetEntry,
        component: TimesheetEntry,
        meta: {
          title: ERouteNames.TimesheetEntry,
          name: ERouteNames.TimesheetEntry,
        },
      },
      {
        path: '/time-management',
        name: ERouteNames.TimeManagement,
        component: TimeManagement,
        meta: {
          title: ERouteNames.TimeManagement,
          name: ERouteNames.TimeManagement,
        },
      },
      {
        path: '/company',
        name: ERouteNames.Company,
        component: Company,
        meta: {
          title: ERouteNames.Company,
          name: ERouteNames.Company,
        },
      },
      {
        path: '/organization-chart',
        name: ERouteNames.CompanyOrganizationChart,
        component: OrganizationChart,
        meta: {
          title: ERouteNames.CompanyOrganizationChart,
          name: ERouteNames.CompanyOrganizationChart,
        },
      },
      {
        path: '/hr-settings',
        name: ERouteNames.HRSettings,
        component: HRSettings,
        meta: {
          title: ERouteNames.HRSettings,
          name: ERouteNames.HRSettings,
        },
      },
      {
        path: '/employees',
        name: ERouteNames.HRSettingsEmployees,
        component: Employees,
        meta: {
          title: ERouteNames.HRSettingsEmployees,
          name: ERouteNames.HRSettingsEmployees,
        },
      },
      {
        path: '/annuals',
        name: ERouteNames.HRSettingsAnnuals,
        component: Annuals,
        meta: {
          title: ERouteNames.HRSettingsAnnuals,
          name: ERouteNames.HRSettingsAnnuals,
        },
        children: [
          {
            path: 'active',
            name: ERouteNames.HRSettingsActiveAnnuals,
            component: AnnualsList,
            meta: {
              title: ERouteNames.HRSettingsActiveAnnuals,
              name: ERouteNames.HRSettingsActiveAnnuals,
            },
          },
          {
            path: 'passive',
            name: ERouteNames.HRSettingsPassiveAnnuals,
            component: AnnualsList,
            meta: {
              title: ERouteNames.HRSettingsPassiveAnnuals,
              name: ERouteNames.HRSettingsPassiveAnnuals,
            },
          },
        ],
      },
      {
        path: '/holidays',
        name: ERouteNames.HRSettingsHolidays,
        component: Holidays,
        meta: {
          title: ERouteNames.HRSettingsHolidays,
          name: ERouteNames.HRSettingsHolidays,
        },
      },
    ],
  },
  // AUTHENTICATION ROUTES (REQUIRES UN_AUTH)
  {
    path: '/login',
    name: ERouteNames.Login,
    component: Login,
    meta: {
      requiresUnAuth: true,
      title: ERouteNames.Login,
    },
  },

  // { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound }
];

export default routes;
