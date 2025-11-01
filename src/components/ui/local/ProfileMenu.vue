<template>
  <Button
    type="button"
    @click="toggle"
    outlined
    aria-haspopup="true"
    severity="contrast"
    aria-controls="overlay_menu"
    unstyled
    size="large"
    pt:root="bg-f-white rounded-md px-2 py-1 border border-gray-300 "
  >
    <ProfileBadge :title="userTitle" onlyTitle />
  </Button>

  <div class="card flex justify-center">
    <Menu ref="menu" :model="items" class="w-full md:w-60" :popup="true">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action" @click="item?.method()">
          <span :class="item.icon" />
          <RouterLink v-if="item?.route" :to="item.route" class="ml-2">
            {{ item.label }}
          </RouterLink>
          <span v-else>{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        </a>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import ProfileBadge from '@/components/ui/local/ProfileBadge.vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { useLogout } from '@/composables/useLogout';

const { t } = useI18n<{ message: MessageSchema }>();
const { logout } = useLogout();

const menu = ref();
const userTitle = ref(t('components.profileMenu.defaultTitle'));

const toggle = (event) => {
  menu.value.toggle(event);
};

const items = computed(() => [
  {
    label: t('common.profile.profile'),
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
</script>

<style scoped></style>
