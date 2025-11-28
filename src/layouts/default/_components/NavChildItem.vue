<template>
  <li class="nav-item" :class="{ 'nav-item--child': depth > 0 }">
    <!-- Folder item (has children) -->
    <template v-if="isFolder">
      <div class="nav-link nav-link--folder" @click="toggle">
        <div class="nav-link__content">
          <i v-if="model.icon" :class="['nav-link__icon', model.icon]"></i>
          <span class="nav-link__label">{{ model.label }}</span>
        </div>
        <i :class="['nav-link__toggle', isOpen ? 'pi pi-angle-down' : 'pi pi-angle-right']"></i>
      </div>
      <ul v-if="isOpen" class="nav-submenu">
        <NavChildItem
          v-for="(child, index) in model.children"
          :key="index"
          :model="child"
          :depth="depth + 1"
        />
      </ul>
    </template>

    <!-- Regular link item (no children) -->
    <template v-else>
      <RouterLink
        v-slot="{ href, navigate, isActive }"
        :to="{ name: model.routeName }"
        custom
      >
        <a
          :href="href"
          :class="[
            'nav-link',
            {
              'nav-link--active': isActive,
              'nav-link--parent': depth === 0,
              'nav-link--child': depth > 0
            }
          ]"
          @click="navigate"
        >
          <div class="nav-link__content">
            <i v-if="model.icon && depth === 0" :class="['nav-link__icon', model.icon]"></i>
            <span class="nav-link__label">{{ model.label }}</span>
          </div>
        </a>
      </RouterLink>
    </template>
  </li>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import type { ERouteNames } from '@/router/routeNames.enum';

export interface IModel {
  label: string;
  icon?: string;
  routeName?: ERouteNames;
  children?: IModel[];
}

interface IProps {
  model: IModel;
  depth?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  depth: 0,
});

const route = useRoute();
const isOpen = ref(false);

const isFolder = computed(() => props.model.children && props.model.children.length > 0);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

// Auto-expand if active child
watch(
  () => route.name,
  () => {
    if (isFolder.value && props.model.children) {
      const hasActiveChild = props.model.children.some((child) => child.routeName === route.name);
      if (hasActiveChild) {
        isOpen.value = true;
      }
    }
  },
  { immediate: true },
);
</script>

<style scoped>
@reference '@/tailwind.css';

.nav-item {
  @apply list-none;
}

.nav-item--child {
  @apply pl-6;
}

.nav-link {
  @apply flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border border-transparent transition-all duration-200;
}

.nav-link:hover {
  @apply border-f-stroke;
}

.nav-link__content {
  @apply flex items-center gap-2;
}

.nav-link__icon {
  @apply text-base text-f-secondary;
}

.nav-link__label {
  @apply text-base text-f-secondary;
}

.nav-link__toggle {
  @apply text-sm text-f-secondary;
}

/* Parent link styles */
.nav-link--parent.nav-link--active {
  @apply bg-f-primary border-f-stroke;
}

.nav-link--parent.nav-link--active .nav-link__icon,
.nav-link--parent.nav-link--active .nav-link__label {
  @apply text-f-white font-semibold;
}

/* Child link styles */
.nav-link--child.nav-link--active {
  @apply bg-f-off-white border-l-4 border-l-f-primary;
}

.nav-link--child.nav-link--active .nav-link__label {
  @apply text-f-primary font-semibold;
}

/* Folder link styles */
.nav-link--folder {
  @apply flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border border-transparent transition-all duration-200;
}

.nav-link--folder:hover {
  @apply border-f-stroke;
}

.nav-submenu {
  @apply list-none mt-1 space-y-1;
}


</style>
