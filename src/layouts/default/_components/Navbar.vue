<template>
  <div class="card flex justify-content-center h-full">
    <div class="flex flex-col justify-between h-full w-full lg:p-0 px-4">
      <div>
        <div class="flex items-center justify-between px-6 py-5 shrink-0">
          <span class="inline-flex items-center gap-2">
            <img class="transform scale-90" src="@/components/images/login-logo.png" />
          </span>
        </div>
        <ul class="space-y-2 font-medium max-w-[328px]">
          <NavItem :nav-items="navItems" />
        </ul>
      </div>
      <div class="flex flex-col gap-4 lg:pb-8">
        <a
          v-ripple
          class="m-4 flex lg:hidden items-center cursor-pointer p-4 gap-2 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
        >
          <ProfileBadge title="Deniz Zeybek" sub-title="Tech Lead" />
        </a>
        <RouterLink class="w-full" block :to="{ name: ERouteNames.SettingsDownload }">
          <Button type="button" icon="pi pi-download" label="Download" class="w-full" />
        </RouterLink>
        <RouterLink class="w-full" block :to="{ name: ERouteNames.Promotion }">
          <Button
            type="button"
            icon="pi pi-gift"
            label="Refer & Get Bonus"
            severity="warn"
            class="w-full"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProfileBadge from '@/components/ui/local/ProfileBadge.vue';
import { useRoute } from 'vue-router';
import NavItem from './NavItem.vue';
import { ERouteNames } from '@/router/routeNames.enum';
import type { IModel } from './NavChildItem.vue';

const route = useRoute();

const expandedKeys = ref({});
const navItems = ref<IModel[]>([
  {
    label: 'Worktime Usage',
    icon: 'pi pi-clock',
    routeName: ERouteNames.WorktimeUsage,
  },
  {
    label: 'Classification',
    icon: 'pi pi-tag',
    routeName: ERouteNames.ClassificationWebAddresses,
  },
  {
    label: 'HR Settings',
    icon: 'pi pi-users',
    routeName: ERouteNames.HRSettings,
    children: [
      {
        label: 'Employees',
        routeName: ERouteNames.HRSettingsEmployees,
      },
      {
        label: 'Annual Leaves',
        routeName: ERouteNames.HRSettingsActiveAnnuals,
      },
      {
        label: 'Holidays',
        routeName: ERouteNames.HRSettingsHolidays,
      },
    ],
  },
  {
    label: 'Company',
    icon: 'pi pi-building',
    routeName: ERouteNames.Company,
    children: [
      {
        label: 'Organization Chart',
        routeName: ERouteNames.CompanyOrganizationChart,
      },
      {
        label: 'Working Hours',
        routeName: ERouteNames.CompanyWorkingHours,
      },
      {
        label: 'Reports',
        routeName: ERouteNames.CompanyReports,
      },
    ],
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    routeName: ERouteNames.Settings,
    children: [
      {
        label: 'Permissions',
        routeName: ERouteNames.SettingsPermissions,
      },
      {
        label: 'Advanced',
        routeName: ERouteNames.SettingsAdvanced,
      },
    ],
  },
]);
</script>

<style>
.itemClass {
  @apply flex items-center cursor-pointer  px-2 hover:border hover:border-purple-600 hover:rounded-md py-2;
}

.activeItemClass {
  @apply bg-f-primary text-f-white rounded-md;
}
</style>
