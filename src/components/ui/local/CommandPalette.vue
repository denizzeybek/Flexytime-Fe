<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :closable="false"
    :draggable="false"
    :dismissableMask="true"
    class="command-palette-dialog"
    :pt="{
      root: { class: 'w-full max-w-2xl' },
      mask: { class: 'backdrop-blur-sm' },
      content: { class: 'p-0 rounded-2xl overflow-hidden' }
    }"
  >
    <template #container>
      <div class="flex flex-col">
        <!-- Search Input -->
        <div class="relative border-b border-gray-200">
          <IconField iconPosition="left" class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              ref="searchInputRef"
              v-model="searchQuery"
              :placeholder="t('components.commandPalette.placeholder')"
              class="w-full !pr-24 !py-4 !text-base !border-none !shadow-none !rounded-none"
              unstyled
              :pt="{
                root: {
                  class: 'w-full pl-12 pr-24 py-4 text-base outline-none border-none bg-transparent focus:ring-0'
                }
              }"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="selectRoute"
              @keydown.esc="closeDialog"
            />
          </IconField>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd class="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">
              {{ isMac ? '⌘' : 'Ctrl' }}
            </kbd>
            <kbd class="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">
              K
            </kbd>
          </div>
        </div>

        <!-- Results -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="filteredRoutes.length === 0" class="px-4 py-8 text-center text-gray-500">
            {{ t('components.commandPalette.noResults') }}
          </div>
          <div v-else class="py-2">
            <Button
              v-for="(route, index) in filteredRoutes"
              :key="route.name"
              text
              :severity="selectedIndex === index ? 'primary' : 'secondary'"
              :class="[
                'w-full !px-4 !py-3 !justify-start !gap-3 !text-left transition-all',
                selectedIndex === index ? '!bg-primary-50 !text-primary-700' : '!bg-transparent hover:!bg-gray-50 !text-gray-700'
              ]"
              :pt="{
                root: { class: 'w-full justify-start' },
                label: { class: 'flex-1 flex items-center gap-3' }
              }"
              @click="navigateToRoute(route)"
              @mouseenter="selectedIndex = index"
            >
              <template #default>
                <i class="pi pi-arrow-right text-sm" />
                <div class="flex-1">
                  <div class="font-medium">{{ route.label }}</div>
                  <div v-if="route.path" class="text-xs text-gray-500 mt-0.5">{{ route.path }}</div>
                </div>
              </template>
            </Button>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { MessageSchema } from '@/plugins/i18n';
import i18n from '@/plugins/i18n';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useI18n<{ message: MessageSchema }>();
const router = useRouter();
const { currentLanguage } = useLanguage();

// Refs
const isVisible = ref(false);
const searchQuery = ref('');
const selectedIndex = ref(0);
const searchInputRef = ref<any>(null);

// Detect platform
const isMac = computed(() => navigator.platform.toUpperCase().indexOf('MAC') >= 0);

// Define route interface
interface RouteItem {
  name: string;
  label: string;
  labelEn: string;
  labelTr: string;
  path: string;
}

// Get all navigable routes
const getAllRoutes = (): RouteItem[] => {
  const routes = router.getRoutes();
  const navigableRoutes: RouteItem[] = [];

  routes.forEach((route) => {
    // Only include routes that have a name and path, exclude auth routes
    if (
      route.name &&
      route.path &&
      route.meta?.requiresAuth !== false &&
      !['Login', 'Register', 'Forgot Password', 'Wizard_Download', 'ForgotPassword'].includes(route.name as string)
    ) {
      const routeName = route.name as string;

      // Get both English and Turkish labels using global i18n
      const labelEn = i18n.global.t(`routes.${routeName}`, {}, { locale: 'en' }) as string;
      const labelTr = i18n.global.t(`routes.${routeName}`, {}, { locale: 'tr' }) as string;
      const currentLabel = t(`routes.${routeName}`) as string;

      navigableRoutes.push({
        name: routeName,
        label: currentLabel,
        labelEn,
        labelTr,
        path: route.path
      });
    }
  });

  return navigableRoutes;
};

// All routes
const allRoutes = ref<RouteItem[]>([]);

// Filtered routes based on search
const filteredRoutes = computed(() => {
  if (!searchQuery.value.trim()) {
    // Show top 3 routes when no search query
    return allRoutes.value.slice(0, 3);
  }

  const query = searchQuery.value.toLowerCase();
  const filtered = allRoutes.value.filter((route) => {
    return (
      route.label.toLowerCase().includes(query) ||
      route.labelEn.toLowerCase().includes(query) ||
      route.labelTr.toLowerCase().includes(query) ||
      route.name.toLowerCase().includes(query) ||
      route.path.toLowerCase().includes(query)
    );
  });

  return filtered;
});

// Keyboard navigation
const navigateDown = () => {
  if (selectedIndex.value < filteredRoutes.value.length - 1) {
    selectedIndex.value++;
  }
};

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

const selectRoute = () => {
  if (filteredRoutes.value.length > 0) {
    navigateToRoute(filteredRoutes.value[selectedIndex.value]);
  }
};

const navigateToRoute = (route: RouteItem) => {
  router.push({ name: route.name });
  closeDialog();
};

const openDialog = () => {
  isVisible.value = true;
  searchQuery.value = '';
  selectedIndex.value = 0;
};

const closeDialog = () => {
  isVisible.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
};

// Keyboard shortcut handler
const handleKeydown = (event: KeyboardEvent) => {
  const isCmdOrCtrl = isMac.value ? event.metaKey : event.ctrlKey;

  if (isCmdOrCtrl && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (isVisible.value) {
      closeDialog();
    } else {
      openDialog();
    }
  }
};

// Watch visibility and focus input
watch(isVisible, async (newVal) => {
  if (newVal) {
    await nextTick();
    searchInputRef.value?.$el?.focus();
  }
});

// Reset selected index when search changes
watch(searchQuery, () => {
  selectedIndex.value = 0;
});

// Reload routes when language changes
watch(currentLanguage, () => {
  allRoutes.value = getAllRoutes();
});

onMounted(() => {
  // Load all routes
  allRoutes.value = getAllRoutes();

  // Add keyboard listener
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// Expose method to parent
defineExpose({
  openDialog,
  closeDialog
});
</script>

<style scoped>
.command-palette-dialog :deep(.p-dialog-mask) {
  backdrop-filter: blur(4px);
}

.command-palette-dialog :deep(.p-dialog) {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Custom scrollbar */
.max-h-96::-webkit-scrollbar {
  width: 8px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
