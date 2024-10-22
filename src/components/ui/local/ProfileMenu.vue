<template>
  <div>
    <Button
      type="button"
      @click="toggle"
      outlined
      aria-haspopup="true"
      severity="contrast"
      aria-controls="overlay_menu"
      unstyled
      pt:root="bg-f-white rounded-md px-4 py-1"
    >
      <ProfileBadge title="Deniz Zeybek" sub-title="Tech Lead"/>
    </Button>

    <div class="card flex justify-center">
      <Menu ref="menu" :model="items" class="w-full md:w-60" :popup="true">
        <template #item="{ item, props }">
          <a v-ripple class="flex items-center" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          </a>
        </template>
      </Menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProfileBadge from '@/components/ui/local/ProfileBadge.vue';

const menu = ref();

const toggle = (event) => {
  menu.value.toggle(event);
};

const items = ref([
  {
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
      },
      //   {
      //     label: 'Messages',
      //     icon: 'pi pi-inbox',
      //     badge: 2,
      //   },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
      },
    ],
  },
]);
</script>

<style scoped></style>
