<template>
  <div class="card flex justify-content-center h-full">
    <div class="flex flex-col justify-between h-full w-full lg:p-0 px-4">
      <div>
        <div class="flex items-center justify-between px-6 py-5 shrink-0">
          <span class="inline-flex items-center gap-2">
            <img class="transform scale-90" src="@/components/images/login-logo.png" />
          </span>
        </div>
        <ul class="flex flex-col gap-2 font-medium max-w-[328px]">
          <NavItem :nav-items="navItems" />
        </ul>
      </div>
      <div class="flex flex-col gap-4 pb-4 lg:pb-8">
        <RouterLink class="w-full" block :to="{ name: ERouteNames.SettingsDownload }">
          <Button type="button" icon="pi pi-download" :label="$t('pages.layouts.navbar.download')" class="w-full" />
        </RouterLink>
        <RouterLink class="w-full" block :to="{ name: ERouteNames.Promotion }">
          <Button
            type="button"
            icon="pi pi-gift"
            :label="$t('pages.layouts.navbar.referBonus')"
            severity="warn"
            class="w-full"
          />
        </RouterLink>
        <a
          v-ripple
          class="flex lg:hidden border border-gray-300 rounded-md items-center cursor-pointer p-4 gap-2 duration-150 transition-colors p-ripple"
        >
          <ProfileBadge title="Deniz Zeybek" sub-title="Tech Lead" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ProfileBadge from '@/components/ui/local/ProfileBadge.vue';
import { ERouteNames } from '@/router/routeNames.enum';

import NavItem from './NavItem.vue';

import type { IModel } from './NavChildItem.vue';


const { t } = useI18n();

const navItems = computed<IModel[]>(() => [
  {
    label: t('pages.layouts.navbar.companies'),
    icon: 'pi pi-building',
    routeName: ERouteNames.SettingsCompanies,
  },
  {
    label: t('pages.layouts.navbar.worktimeUsage'),
    icon: 'pi pi-chart-line',
    routeName: ERouteNames.WorktimeUsage,
  },
  {
    label: t('pages.layouts.navbar.timeEntries'),
    routeName: ERouteNames.TimeEntriesManual,
  },
  {
    label: t('pages.layouts.navbar.timeManagement'),
    routeName: ERouteNames.TimeManagementPerson,
  },
  {
    label: t('pages.layouts.navbar.reports'),
    routeName: ERouteNames.CompanyReportsElastic,
  },
  {
    label: t('pages.layouts.navbar.hrSettings'),
    icon: 'pi pi-users',
    routeName: ERouteNames.HRSettings,
    children: [
      {
        label: t('pages.layouts.navbar.employees'),
        routeName: ERouteNames.HRSettingsEmployees,
      },
      {
        label: t('pages.layouts.navbar.annualLeaves'),
        routeName: ERouteNames.HRSettingsActiveAnnuals,
      },
      {
        label: t('pages.layouts.navbar.holidays'),
        routeName: ERouteNames.HRSettingsHolidays,
      },
    ],
  },
  {
    label: t('pages.layouts.navbar.company'),
    icon: 'pi pi-building',
    routeName: ERouteNames.Company,
    children: [
      {
        label: t('pages.layouts.navbar.organizationChart'),
        routeName: ERouteNames.CompanyOrganizationChart,
      },
      {
        label: t('pages.layouts.navbar.workingHours'),
        routeName: ERouteNames.CompanyWorkingHours,
      },
    ],
  },
  {
    label: t('pages.layouts.navbar.settings'),
    icon: 'pi pi-cog',
    routeName: ERouteNames.Settings,
    children: [
      {
        label: t('pages.layouts.navbar.classification'),
        routeName: ERouteNames.ClassificationWebAddresses,
      },
      {
        label: t('pages.layouts.navbar.permissions'),
        routeName: ERouteNames.SettingsPermissions,
      },
      {
        label: t('pages.layouts.navbar.advanced'),
        routeName: ERouteNames.SettingsAdvanced,
      },
    ],
  },
]);
</script>

<style>
@reference "@/custom-tailwind.css";
.itemClass {
  @apply flex items-center cursor-pointer  px-2 hover:border hover:border-purple-600 hover:rounded-md py-2;
}

.activeItemClass {
  @apply bg-f-primary text-f-white rounded-md;
}
</style>
