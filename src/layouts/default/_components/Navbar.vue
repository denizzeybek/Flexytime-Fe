<template>
  <div class="card flex justify-content-center h-full">
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center justify-between px-6 pt-7 shrink-0">
          <span class="inline-flex items-center gap-2">
            <img class="transform scale-90" src="@/components/images/login-logo.png" />
          </span>
        </div>
        <div class="overflow-y-auto my-4">
          <ul class="list-none m-0">
            <li>
              <PanelMenu
                unstyled
                v-model:expandedKeys="expandedKeys"
                :model="items"
                class="w-50 flex flex-col gap-2"
              >
                <template #item="{ item }">
                  <router-link
                    v-if="item.route"
                    v-slot="{ href, navigate }"
                    :to="item.route"
                    custom
                  >
                    <a
                      v-ripple
                      class="itemClass"
                      :class="{ activeItemClass: route.fullPath === item.route }"
                      :href="href"
                      @click="navigate"
                    >
                      <span :class="item.icon" />
                      <span class="ml-2">{{ item.label }}</span>
                    </a>
                  </router-link>
                  <a
                    v-else
                    v-ripple
                    class="itemClass"
                    :class="{ activeItemClass: route.fullPath === item.route }"
                    :href="item.url"
                    :target="item.target"
                  >
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
                  </a>
                </template>
              </PanelMenu>
            </li>
          </ul>
        </div>
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

const route = useRoute();

const expandedKeys = ref({});
const items = ref([
  {
    label: 'Worktime Usage',
    icon: 'pi pi-clock',
    route: '/',
    key: '0',
  },
  {
    label: 'Classification',
    icon: 'pi pi-tag',
    route: '/classification/web-addresses',
    key: '1',
  },
  {
    label: 'Time Sheets',
    icon: 'pi pi-stopwatch',
    key: '2',
    items: [
      {
        label: 'TimeSheet Entry',
        route: '/timesheet-entry',
      },

      {
        label: 'Time Management',
        route: '/time-management',
      },
    ],
  },
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
