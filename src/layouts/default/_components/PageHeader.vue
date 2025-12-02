<template>
  <div
    class="flex justify-between items-center py-4 px-6 bg-white rounded-2xl shadow-lg border border-gray-100"
  >
    <div class="flex items-center gap-3">
      <div class="block lg:hidden">
        <Button icon="pi pi-bars" text rounded @click="$emit('drawerChange', true)" />
      </div>
      <h1 class="text-2xl font-semibold text-gray-800 tracking-tight">{{ localizedRouteName }}</h1>
    </div>
    <div class="hidden lg:flex items-center gap-3">
      <Button
      icon="pi pi-shopping-cart"
      :label="t('pages.layouts.pageHeader.upgrade.label')"
      severity="warn"
      class="shadow-md hover:shadow-lg transition-all"
      @click="goToPayment"
      />
      <!-- Command Palette Trigger -->
      <Button
        variant="outlined"
        severity="secondary"
        @click="openCommandPalette"
      >
        <template #default>
          <i class="pi pi-search text-xs" />
          <kbd class="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded">
            {{ isMac ? '⌘' : 'Ctrl' }}
          </kbd>
          <kbd class="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded">
            K
          </kbd>
        </template>
      </Button>
      <ProfileMenu />
    </div>

    <!-- Command Palette Modal -->
    <CommandPalette ref="commandPaletteRef" />
  </div>
</template>

<script setup lang="ts">
import { computed,ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import CommandPalette from '@/components/ui/local/CommandPalette.vue';
import ProfileMenu from '@/components/ui/local/ProfileMenu.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';

interface IEmits {
  (event: 'drawerChange', val: boolean): void;
}

defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const route = useRoute();
const router = useRouter();

const commandPaletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);

const isMac = computed(() => navigator.platform.toUpperCase().indexOf('MAC') >= 0);

const localizedRouteName = computed(() => {
  const routeName = route.name as string;
  if (!routeName) return '';
  // Try to get translation, fallback to route name if not found
  const key = `routes.${routeName}` as any;
  return t(key);
});

const openCommandPalette = () => {
  commandPaletteRef.value?.openDialog();
};

const goToPayment = () => {
  router.push({ name: ERouteNames.Payment });
};
</script>
