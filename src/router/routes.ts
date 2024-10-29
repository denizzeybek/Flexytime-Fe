import type { RouteRecordRaw } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';
import DefaultLayout from '@/layouts/default/DefaultLayout.vue';
import WorktimeUsage from '@/views/worktimeUsage/_views/WorktimeUsage.vue';

import Classification from '@/views/classification/_views/Classification.vue';
import ClassificationWebAddresses from '@/views/classification/_views/WebAddresses.vue';
import ClassificationApplications from '@/views/classification/_views/Applications.vue';

import TimesheetEntry from '@/views/timesheets/_views/TimesheetEntry.vue';
import TimeManagement from '@/views/timesheets/_views/TimeManagement.vue';

// Company
import Company from '@/views/company/_views/Company.vue';
import OrganizationChart from '@/views/company/_views/OrganizationChart.vue';
import WorkingHours from '@/views/company/_views/WorkingHours.vue';
import Reports from '@/views/company/_views/Reports.vue';

// HR Settings
import HRSettings from '@/views/hrSettings/_views/HRSettings.vue';
import Employees from '@/views/hrSettings/_views/Employees.vue';
import Annuals from '@/views/hrSettings/_views/Annuals.vue';
import Holidays from '@/views/hrSettings/_views/Holidays.vue';

// Settings
import Settings from '@/views/settings/_views/Settings.vue';
import Permissions from '@/views/settings/_views/Permissions.vue';
import Advanced from '@/views/settings/_views/Advanced.vue';

import Profile from '@/views/profile/_views/Profile.vue';
import Basic from '@/views/profile/_components/Basic.vue';
import License from '@/views/profile/_components/License.vue';
import Communications from '@/views/profile/_components/Communications.vue';
import Password from '@/views/profile/_components/Password.vue';

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
        path: '/working-hours',
        name: ERouteNames.CompanyWorkingHours,
        component: WorkingHours,
        meta: {
          title: ERouteNames.CompanyWorkingHours,
          name: ERouteNames.CompanyWorkingHours,
        },
      },
      {
        path: '/reports',
        name: ERouteNames.CompanyReports,
        component: Reports,
        meta: {
          title: ERouteNames.CompanyReports,
          name: ERouteNames.CompanyReports,
        },
      },
      {
        path: '/settings',
        name: ERouteNames.Settings,
        component: Settings,
        meta: {
          title: ERouteNames.Settings,
          name: ERouteNames.Settings,
        },
      },
      {
        path: '/permissions',
        name: ERouteNames.SettingsPermissions,
        component: Permissions,
        meta: {
          title: ERouteNames.SettingsPermissions,
          name: ERouteNames.SettingsPermissions,
        },
      },
      {
        path: '/advanced',
        name: ERouteNames.SettingsAdvanced,
        component: Advanced,
        meta: {
          title: ERouteNames.SettingsAdvanced,
          name: ERouteNames.SettingsAdvanced,
        },
      },
      {
        path: '/profile',
        name: ERouteNames.Profile,
        component: Profile,
        meta: {
          title: ERouteNames.Profile,
          name: ERouteNames.Profile,
        },
        children: [
          {
            path: 'basic',
            name: ERouteNames.ProfileBasic,
            component: Basic,
            meta: {
              title: ERouteNames.ProfileBasic,
              name: ERouteNames.ProfileBasic,
            },
          },
          {
            path: 'license',
            name: ERouteNames.ProfileLicense,
            component: License,
            meta: {
              title: ERouteNames.ProfileLicense,
              name: ERouteNames.ProfileLicense,
            },
          },
          {
            path: 'communicaitons',
            name: ERouteNames.ProfileCommunication,
            component: Communications,
            meta: {
              title: ERouteNames.ProfileCommunication,
              name: ERouteNames.ProfileCommunication,
            },
          },
          {
            path: 'password',
            name: ERouteNames.ProfilePassword,
            component: Password,
            meta: {
              title: ERouteNames.ProfilePassword,
              name: ERouteNames.ProfilePassword,
            },
          },
        ],
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
