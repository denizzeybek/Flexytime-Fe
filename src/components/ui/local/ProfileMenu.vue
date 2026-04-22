<template>
  <Button
    class="w-full lg:w-fit capitalize"
    type="button"
    variant="outlined"
    aria-haspopup="true"
    severity="secondary"
    aria-controls="overlay_menu"
    icon="pi pi-user"
    :label="userName"
    @click="toggle"
  />


  <div class="card flex justify-center">
    <Menu ref="menu" :model="items" class="w-40 lg:w-60" :popup="true">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action" @click="onItemClick(item)">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        </a>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, type RouteLocationRaw } from 'vue-router';

import { useLogout } from '@/composables/useLogout';
import { useProfile } from '@/composables/useProfile';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';

type IMenuItem = {
  route?: RouteLocationRaw;
  method?: () => void;
  [key: string]: unknown;
};

const { t } = useI18n<{ message: MessageSchema }>();
const { logout } = useLogout();
const { userName, userTitle } = useProfile();
const router = useRouter();

const menu = ref();


const items = computed(() => [
  {
    label: userTitle.value,
    items: [
      {
        label: t('common.profile.profile'),
        icon: 'pi pi-user',
        route: { name: ERouteNames.ProfileBasic },
      },
      {
        label: t('common.profile.logout'),
        icon: 'pi pi-sign-out',
        method: () => {
          logout();
        }
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const onItemClick = (item: IMenuItem) => {
  if (item.route) {
    router.push(item.route);
    return;
  }
  item.method?.();
};
</script>

<style>
@reference "@/tailwind.css";

/* Scoped button styles */
.p-button-outlined.p-button-contrast {
  @apply !border-f-gray !bg-f-white;
}
</style>

