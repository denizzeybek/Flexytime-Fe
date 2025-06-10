import type { RouteRecordRaw } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';
import DefaultLayout from '@/layouts/default/DefaultLayout.vue';
import WorktimeUsage from '@/views/worktimeUsage/_views/WorktimeUsage.vue';
import ProductivityTeam from '@/views/worktimeUsage/_components/subPages/productivity/Team.vue'
import ProductivityIndividuals from '@/views/worktimeUsage/_components/subPages/productivity/Individuals.vue'
import ProductivityGraph from '@/views/worktimeUsage/_components/subPages/productivity/Graph.vue'
import Distribution from '@/views/worktimeUsage/_components/subPages/distribution/Distribution.vue'


// Classification
import Classification from '@/views/classification/_views/Classification.vue';
import ClassificationWebAddresses from '@/views/classification/_views/WebAddresses.vue';
import ClassificationApplications from '@/views/classification/_views/Applications.vue';

// Timesheets
import Timesheets from '@/views/timesheets/_views/TimeSheets.vue';
import TimeEntries from '@/views/timesheets/_views/TimeEntries.vue';
import ManualTimeEntries from '@/views/timesheets/_views/ManualTimeEntries.vue';
import UnclassifiedTimeEntries from '@/views/timesheets/_views/UnclassifiedTimeEntries.vue';
import TimeManagement from '@/views/timesheets/_views/TimeManagement.vue';
import TimeManagementProject from '@/views/timesheets/_components/timeManagement/Project.vue';
import TimeManagementPerson from '@/views/timesheets/_components/timeManagement/Person.vue';

// Company
import Company from '@/views/company/_views/Company.vue';
import OrganizationChart from '@/views/company/_views/OrganizationChart.vue';
import WorkingHours from '@/views/company/_views/WorkingHours.vue';
import Reports from '@/views/company/_views/reports/Reports.vue';

// HR Settings
import HRSettings from '@/views/hrSettings/_views/HRSettings.vue';
import Employees from '@/views/hrSettings/_views/Employees.vue';
import Annuals from '@/views/hrSettings/_views/Annuals.vue';
import Holidays from '@/views/hrSettings/_views/Holidays.vue';
import AnnualsList from '@/views/hrSettings/_components/annuals/AnnualsList.vue';
import ElasticReports from '@/views/company/_views/reports/ElasticReports.vue';
import DefaultReports from '@/views/company/_views/reports/DefaultReports.vue';

// Settings
import Settings from '@/views/settings/_views/Settings.vue';
import Permissions from '@/views/settings/_views/Permissions.vue';
import Advanced from '@/views/settings/_views/Advanced.vue';
import Download from '@/views/download/_views/Download.vue';
import Companies from '@/views/settings/_views/Companies.vue';

import Profile from '@/views/profile/_views/Profile.vue';
import Basic from '@/views/profile/_components/Basic.vue';
import License from '@/views/profile/_components/License.vue';
import Communications from '@/views/profile/_components/Communications.vue';
import Password from '@/views/profile/_components/Password.vue';

import Promotion from '@/views/promotion/_views/Promotion.vue';

import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import WizardDownload from '@/views/auth/WizardDownload.vue';
import { EHeader } from '@/common/enums/token.enum';
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
        path: '/clock/section',
        alias: '',
        name: ERouteNames.WorktimeUsage,
        component: WorktimeUsage,
        meta: {
          title: ERouteNames.WorktimeUsage,
          name: ERouteNames.WorktimeUsage,
        },
        children: [
          {
            path: 'productivity-individuals',
            name: ERouteNames.WorktimeUsageProductivityIndividuals,
            component: ProductivityIndividuals,
            meta: {
              title: ERouteNames.WorktimeUsage,
              name: ERouteNames.WorktimeUsage,
            }
          },
          {
            path: 'productivity-team',
            name: ERouteNames.WorktimeUsageProductivityTeam,
            component: ProductivityTeam,
            meta: {
              title: ERouteNames.WorktimeUsage,
              name: ERouteNames.WorktimeUsage,
            }
          },
          {
            path: 'productivity-graph',
            name: ERouteNames.WorktimeUsageProductivityGraph,
            component: ProductivityGraph,
            meta: {
              title: ERouteNames.WorktimeUsage,
              name: ERouteNames.WorktimeUsage,
            }
          },
          {
            path: 'distribution',
            name: ERouteNames.WorktimeUsageDistribution,
            component: Distribution,
            meta: {
              title: ERouteNames.WorktimeUsage,
              name: ERouteNames.WorktimeUsage,
            }
          },
        ],
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
        path: '/timesheets',
        name: ERouteNames.Timesheets,
        component: Timesheets,
        meta: {
          title: ERouteNames.Timesheets,
          name: ERouteNames.Timesheets,
        },
      },
      {
        path: '/timesheet-entry',
        name: ERouteNames.TimeEntries,
        component: TimeEntries,
        meta: {
          title: ERouteNames.TimeEntries,
          name: ERouteNames.TimeEntries,
        },
        children: [
          {
            path: 'manual',
            name: ERouteNames.TimeEntriesManual,
            component: ManualTimeEntries,
            meta: {
              title: ERouteNames.TimeEntriesManual,
              name: ERouteNames.TimeEntriesManual,
            },
          },
          {
            path: 'unclassified',
            name: ERouteNames.TimeEntriesUnclassified,
            component: UnclassifiedTimeEntries,
            meta: {
              title: ERouteNames.TimeEntriesUnclassified,
              name: ERouteNames.TimeEntriesUnclassified,
            },
          },
        ],
      },
      {
        path: '/time-management',
        name: ERouteNames.TimeManagement,
        component: TimeManagement,
        meta: {
          title: ERouteNames.TimeManagement,
          name: ERouteNames.TimeManagement,
        },
        children: [
          {
            path: 'person',
            name: ERouteNames.TimeManagementPerson,
            component: TimeManagementPerson,
            meta: {
              title: ERouteNames.TimeManagementPerson,
              name: ERouteNames.TimeManagementPerson,
            },
          },
          {
            path: 'project',
            name: ERouteNames.TimeManagementProject,
            component: TimeManagementProject,
            meta: {
              title: ERouteNames.TimeManagementProject,
              name: ERouteNames.TimeManagementProject,
            },
          },
        ],
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
        children: [
          {
            path: 'elastic',
            name: ERouteNames.CompanyReportsElastic,
            component: ElasticReports,
            meta: {
              title: ERouteNames.CompanyReportsElastic,
              name: ERouteNames.CompanyReportsElastic,
            },
          },
          {
            path: 'default',
            name: ERouteNames.CompanyReportsDefault,
            component: DefaultReports,
            meta: {
              title: ERouteNames.CompanyReportsDefault,
              name: ERouteNames.CompanyReportsDefault,
            },
          },
        ],
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
      {
        path: '/download',
        name: ERouteNames.SettingsDownload,
        component: Download,
        meta: {
          title: ERouteNames.SettingsDownload,
          name: ERouteNames.SettingsDownload,
        },
      },
      {
        path: '/companies',
        name: ERouteNames.SettingsCompanies,
        component: Companies,
        meta: {
          title: ERouteNames.SettingsCompanies,
          name: ERouteNames.SettingsCompanies,
        },
      },
      {
        path: '/promotion',
        name: ERouteNames.Promotion,
        component: Promotion,
        meta: {
          title: ERouteNames.Promotion,
          name: ERouteNames.Promotion,
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
      name: ERouteNames.Login,
      header: EHeader.BASIC
    },
  },
  {
    path: '/register',
    name: ERouteNames.Register,
    component: Register,
    meta: {
      requiresUnAuth: true,
      title: ERouteNames.Register,
      name: ERouteNames.Register,
    },
  },
  {
    path: '/wizard-download',
    name: ERouteNames.Wizard_Download,
    component: WizardDownload,
    meta: {
      requiresUnAuth: true,
      title: ERouteNames.Wizard_Download,
      name: ERouteNames.Wizard_Download,
    },
  },
  {
    path: '/forgot-password',
    name: ERouteNames.ForgotPassword,
    component: ForgotPassword,
    meta: {
      requiresUnAuth: true,
      title: ERouteNames.ForgotPassword,
      name: ERouteNames.ForgotPassword,
    },
  },

  // { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound }
];

export default routes;
