<template>
  <div
    class="flex justify-between items-center py-4 px-6 rounded-2xl shadow-lg border transition-colors duration-300
           bg-surface-primary dark:bg-surface-elevated
           border-border-secondary dark:border-border-primary"
  >
    <div class="flex items-center gap-3">
      <div class="block lg:hidden">
        <Button icon="pi pi-bars" text rounded @click="$emit('drawerChange', true)" />
      </div>
      <h1 class="text-2xl font-semibold text-content-primary tracking-tight">{{ localizedRouteName }}</h1>
    </div>
    <div class="flex lg:hidden items-center gap-2">
      <ThemeToggle />
    </div>
    <div class="hidden lg:flex items-center gap-2">
      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Command Palette Trigger -->
      <Button
        text
        rounded
        class="!px-3 !py-2 !text-content-secondary dark:!text-content-tertiary hover:!text-content-primary dark:hover:!text-content-primary hover:!bg-surface-tertiary dark:hover:!bg-surface-tertiary transition-all"
        @click="openCommandPalette"
      >
        <template #default>
          <div class="flex items-center gap-2">
            <i class="pi pi-search text-sm" />
            <div class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 text-[10px] font-medium rounded bg-surface-tertiary dark:bg-surface-tertiary border border-border-primary dark:border-border-secondary">
                {{ isMac ? '⌘' : 'Ctrl' }}
              </kbd>
              <kbd class="px-1.5 py-0.5 text-[10px] font-medium rounded bg-surface-tertiary dark:bg-surface-tertiary border border-border-primary dark:border-border-secondary">
                K
              </kbd>
            </div>
          </div>
        </template>
      </Button>

      <!-- Upgrade Button -->
      <Button
        icon="pi pi-sparkles"
        :label="t('pages.layouts.pageHeader.upgrade.label')"
        class="!bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600 dark:!from-amber-500 dark:!to-orange-500 dark:hover:!from-amber-400 dark:hover:!to-orange-400 !text-white !border-0 !shadow-lg !shadow-amber-500/25 dark:!shadow-amber-500/20 hover:!shadow-xl hover:!shadow-amber-500/30 transition-all !rounded-xl"
        @click="goToPayment"
      />

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
import ThemeToggle from '@/components/ui/local/ThemeToggle.vue';
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
