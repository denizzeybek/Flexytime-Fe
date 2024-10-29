<template>
  <Button
    type="button"
    @click="toggle"
    outlined
    aria-haspopup="true"
    severity="contrast"
    aria-controls="overlay_menu"
    unstyled
    pt:root="bg-f-white rounded-md px-4 "
  >
    <ProfileBadge title="Deniz Zeybek" />
  </Button>

  <div class="card flex justify-center">
    <Menu ref="menu" :model="items" class="w-full md:w-60" :popup="true">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
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
import { ref } from 'vue';
import ProfileBadge from '@/components/ui/local/ProfileBadge.vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRouter } from 'vue-router';

const router = useRouter();

const menu = ref();

const toggle = (event) => {
  menu.value.toggle(event);
};

const items = ref([
  {
    label: 'Tech Lead',
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        route: { name: ERouteNames.Profile },
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
      },
    ],
  },
]);
</script>

<style scoped></style>
