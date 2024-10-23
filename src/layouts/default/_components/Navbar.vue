<template>
  <div class="card flex justify-content-center h-full">
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center justify-between px-6 py-5 shrink-0">
          <span class="inline-flex items-center gap-2">
            <img class="transform scale-90" src="@/components/images/login-logo.png" />
          </span>
        </div>
        <ul class="space-y-2 font-medium max-w-[328px]">
          <NavItem
            v-for="item in navItems"
            :key="item.label"
            :label="item.label"
            :routeName="item.routeName"
            :icon="item.icon"
          />
        </ul>
      </div>
      <div class="">
        <hr class="mb-4 mx-4 border-t border-0 border-surface-200 dark:border-surface-700" />
        <a
          v-ripple
          class="m-4 flex items-center cursor-pointer p-4 gap-2 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
        >
          <ProfileBadge title="Deniz Zeybek" sub-title="Tech Lead" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProfileBadge from '@/components/ui/local/ProfileBadge.vue';
import { useRoute } from 'vue-router';
import NavItem, { type IProps as INavItem } from './NavItem.vue';
import { ERouteNames } from '@/router/routeNames.enum';

const route = useRoute();

const expandedKeys = ref({});
const navItems = ref([
  {
    label: 'Worktime Usage',
    icon: 'pi pi-clock',
    routeName: ERouteNames.WorktimeUsage,
    key: '0',
  },
  {
    label: 'Classification',
    icon: 'pi pi-tag',
    routeName: ERouteNames.ClassificationWebAddresses,
    key: '1',
  },
  // {
  //   label: 'Time Sheets',
  //   icon: 'pi pi-stopwatch',
  //   key: '2',
  //   routeName: ERouteNames.TimeManagement,
  //   // items: [
  //   //   {
  //   //     label: 'TimeSheet Entry',
  //   //     routeName: ERouteNames.TimesheetEntry,
  //   //   },

  //   //   {
  //   //     label: 'Time Management',
  //   //     routeName: ERouteNames.TimeManagement,
  //   //   },
  //   // ],
  // },
]);

const expandNode = (node) => {
  if (node.items && node.items.length) {
    expandedKeys.value[node.key] = true;

    for (let child of node.items) {
      expandNode(child);
    }
  }
};
</script>

<style>
.itemClass {
  @apply flex items-center cursor-pointer  px-2 hover:border hover:border-purple-600 hover:rounded-md py-2;
}

.activeItemClass {
  @apply bg-f-primary text-f-white rounded-md;
}
</style>
