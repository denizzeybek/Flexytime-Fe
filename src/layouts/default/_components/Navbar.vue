<template>
  <div class="flex flex-col justify-between h-full w-full lg:p-0 px-4">
    <div>
      <!-- Logo -->
      <div class="flex items-center justify-between px-6 py-5 shrink-0">
        <span class="inline-flex items-center gap-2">
          <img class="transform scale-90" src="@/components/images/login-logo.png" />
        </span>
      </div>

      <!-- Navigation Menu -->
      <PanelMenu v-model:expandedKeys="expandedKeys" :model="menuItems">
        <template #item="{ item }">
          <!-- Leaf items with routes -->
          <RouterLink
            v-if="item.route"
            v-slot="{ href, navigate, isActive }"
            :to="{ name: item.route }"
            custom
          >
            <a
              v-ripple
              :href="href"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all w-full',
                {
                  'bg-purple-600 shadow-sm': isActive && !item.isChild,
                  'bg-gray-50 border-l-4 border-l-purple-600': isActive && item.isChild,
                  'border-l-4 border-l-transparent': !isActive && item.isChild,
                  'hover:bg-gray-50': !isActive
                }
              ]"
              @click="navigate"
            >
              <i
                v-if="item.icon"
                :class="[
                  item.icon,
                  'text-base',
                  {
                    'text-white': isActive && !item.isChild,
                    'text-f-primary': isActive && item.isChild,
                    'text-gray-600': !isActive
                  }
                ]"
              ></i>
              <span
                :class="[
                  'text-[14px] font-medium whitespace-nowrap',
                  {
                    'text-white font-semibold': isActive && !item.isChild,
                    'text-f-primary font-semibold': isActive && item.isChild,
                    'text-gray-600': !isActive
                  }
                ]"
              >
                {{ item.label }}
              </span>
            </a>
          </RouterLink>

          <!-- Parent items with children (no route) -->
          <div
            v-else
            class="flex items-center justify-between px-3 py-2 gap-2 text-gray-600 w-full"
          >
            <div class="flex items-center gap-2">
              <i v-if="item.icon" :class="[item.icon, 'text-base']"></i>
              <span class="text-[14px] font-medium whitespace-nowrap">{{ item.label }}</span>
            </div>
            <i
              v-if="item.items"
              :class="[
                'pi text-sm text-gray-400 transition-transform',
                item.key && expandedKeys[item.key] ? 'pi-chevron-down' : 'pi-chevron-right'
              ]"
            ></i>
          </div>
        </template>
      </PanelMenu>
    </div>

    <!-- Bottom Actions -->
    <div class="flex flex-col gap-4 pb-4 lg:pb-8">
      <RouterLink class="w-full" block :to="{ name: ERouteNames.SettingsDownload }">
        <Button
          type="button"
          icon="pi pi-download"
          :label="$t('pages.layouts.navbar.download')"
          class="w-full"
        />
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
      <div class="lg:hidden flex">
        <ProfileMenu />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import PanelMenu from 'primevue/panelmenu';

import ProfileMenu from '@/components/ui/local/ProfileMenu.vue';
import { ERouteNames } from '@/router/routeNames.enum';

const { t } = useI18n();
const route = useRoute();

const expandedKeys = ref<Record<string, boolean>>({});

// Route'a göre hangi menünün açık olacağını belirle
const updateExpandedKeys = () => {
  const currentRoute = route.name as ERouteNames;
  const newExpandedKeys: Record<string, boolean> = {};

  // HR Settings altındaki route'lar
  const hrSettingsRoutes = [
    ERouteNames.HRSettingsEmployees,
    ERouteNames.HRSettingsActiveAnnuals,
    ERouteNames.HRSettingsHolidays,
  ];

  // Company altındaki route'lar
  const companyRoutes = [
    ERouteNames.CompanyOrganizationChart,
    ERouteNames.CompanyWorkingHours,
  ];

  // Settings altındaki route'lar
  const settingsRoutes = [
    ERouteNames.ClassificationWebAddresses,
    ERouteNames.SettingsPermissions,
    ERouteNames.SettingsAdvanced,
  ];

  if (hrSettingsRoutes.includes(currentRoute)) {
    newExpandedKeys[ERouteNames.HRSettingsEmployees] = true;
  } else if (companyRoutes.includes(currentRoute)) {
    newExpandedKeys[ERouteNames.CompanyOrganizationChart] = true;
  } else if (settingsRoutes.includes(currentRoute)) {
    newExpandedKeys[ERouteNames.ClassificationWebAddresses] = true;
  }

  expandedKeys.value = newExpandedKeys;
};

// İlk yüklemede ve route değiştiğinde güncelle
updateExpandedKeys();
watch(() => route.name, updateExpandedKeys);

const menuItems = computed(() => [
  {
    label: t('pages.layouts.navbar.companies'),
    icon: 'pi pi-building',
    route: ERouteNames.SettingsCompanies,
  },
  {
    label: t('pages.layouts.navbar.worktimeUsage'),
    icon: 'pi pi-chart-line',
    route: ERouteNames.WorktimeUsage,
  },
  {
    label: t('pages.layouts.navbar.timeEntries'),
    icon: 'pi pi-clock',
    route: ERouteNames.TimeEntriesManual,
  },
  {
    label: t('pages.layouts.navbar.timeManagement'),
    icon: 'pi pi-calendar',
    route: ERouteNames.TimeManagementPerson,
  },
  {
    label: t('pages.layouts.navbar.reports'),
    icon: 'pi pi-chart-bar',
    route: ERouteNames.CompanyReportsElastic,
  },
  {
    key: ERouteNames.HRSettingsEmployees, // Parent key = ilk child route
    label: t('pages.layouts.navbar.hrSettings'),
    icon: 'pi pi-users',
    items: [
      {
        label: t('pages.layouts.navbar.employees'),
        icon: 'pi pi-user',
        route: ERouteNames.HRSettingsEmployees,
        isChild: true,
      },
      {
        label: t('pages.layouts.navbar.annualLeaves'),
        icon: 'pi pi-calendar-minus',
        route: ERouteNames.HRSettingsActiveAnnuals,
        isChild: true,
      },
      {
        label: t('pages.layouts.navbar.holidays'),
        icon: 'pi pi-sun',
        route: ERouteNames.HRSettingsHolidays,
        isChild: true,
      },
    ],
  },
  {
    key: ERouteNames.CompanyOrganizationChart, // Parent key = ilk child route
    label: t('pages.layouts.navbar.company'),
    icon: 'pi pi-building',
    items: [
      {
        label: t('pages.layouts.navbar.organizationChart'),
        icon: 'pi pi-sitemap',
        route: ERouteNames.CompanyOrganizationChart,
        isChild: true,
      },
      {
        label: t('pages.layouts.navbar.workingHours'),
        icon: 'pi pi-clock',
        route: ERouteNames.CompanyWorkingHours,
        isChild: true,
      },
    ],
  },
  {
    key: ERouteNames.ClassificationWebAddresses, // Parent key = ilk child route
    label: t('pages.layouts.navbar.settings'),
    icon: 'pi pi-cog',
    items: [
      {
        label: t('pages.layouts.navbar.classification'),
        icon: 'pi pi-tags',
        route: ERouteNames.ClassificationWebAddresses,
        isChild: true,
      },
      {
        label: t('pages.layouts.navbar.permissions'),
        icon: 'pi pi-shield',
        route: ERouteNames.SettingsPermissions,
        isChild: true,
      },
      {
        label: t('pages.layouts.navbar.advanced'),
        icon: 'pi pi-sliders-h',
        route: ERouteNames.SettingsAdvanced,
        isChild: true,
      },
    ],
  },
]);
</script>
