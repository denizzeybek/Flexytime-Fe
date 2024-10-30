<template>
  <div @click="toggle" :style="{ paddingLeft: `${indent}px` }">
    <li class="text-base list-none">
      <RouterLink
        v-if="!isFolder"
        :to="{ name: model?.routeName }"
        v-slot="{ href, navigate }"
        custom
      >
        <!-- Link for non-folder items -->
        <a
          :href="href"
          @click="navigate"
          :data-active="isActive"
          class="flex justify-between items-center"
        >
          <div class="flex items-center gap-2">
            <span
              :class="[isActive ? '!text-f-white' : '!text-f-secondary', model?.icon]"
              style="font-size: 1rem"
            />
            <FText
              :as="isActive ? 'h6' : 'p'"
              :class="[isActive ? '!text-f-white' : '!text-f-secondary']"
            >
              {{ model.label }}
            </FText>
          </div>
          <Button
            v-show="isFolder"
            :icon="iconClass"
            unstyled
            pt:root="flex items-center justify-center"
          ></Button>
        </a>
      </RouterLink>
      <div v-else class="flex justify-between items-center cursor-pointer">
        <!-- Non-navigable folder items -->
        <div class="flex items-center gap-2 root-folder">
          <span
            :class="[isActive ? '!text-f-white' : '!text-f-secondary', model?.icon]"
            style="font-size: 1rem"
          />
          <FText
            :as="isActive ? 'h6' : 'p'"
            :class="[isActive ? '!text-f-white' : '!text-f-secondary']"
          >
            {{ model.label }}
          </FText>
        </div>
        <Button
          v-show="isFolder"
          :icon="iconClass"
          unstyled
          pt:root="flex items-center justify-center"
        ></Button>
      </div>
    </li>
  </div>

  <div v-show="isOpen" v-if="isFolder">
    <NavChildItem
      v-for="(childModel, index) in model.children"
      :key="index"
      :model="childModel"
      :depth="depth + 1"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ERouteNames } from '@/router/routeNames.enum';
import { RouterLink, useRoute, useRouter } from 'vue-router';

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

const { model, depth = 0 } = defineProps<IProps>();

const route = useRoute();
const router = useRouter();

const isOpen = ref(false);
const href = router.resolve({ name: model?.routeName }).href;

const isFolder = computed(() => model?.children && model?.children?.length);
const indent = computed(() => depth * 25);
const iconClass = computed(() => (isOpen.value ? 'pi pi-angle-down' : 'pi pi-angle-right'));

const isActive = computed(
  () => route.name === model?.routeName || route?.fullPath?.split('/')[1] === href?.split('/')[1],
);
// Methods
const toggle = () => (isOpen.value = !isOpen.value);

watch(
  route,
  () => {
    if (isFolder.value) {
      isOpen.value =
        model?.children?.some((child) => {
          return child.routeName === route.name;
        }) || false;
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.root-folder {
  @apply flex gap-2 items-center px-3 py-[9px] lg:py-[5px] rounded-lg cursor-pointer  border border-transparent active:bg-f-off-white transition-colors duration-200 ease-in-out;
}
a {
  @apply flex gap-2 items-center px-3 py-[9px] lg:py-[5px] rounded-lg cursor-pointer hover:border-f-stroke border border-transparent active:bg-f-off-white transition-colors duration-200 ease-in-out;
}

a[data-active='true'] {
  @apply bg-f-primary  border-f-stroke;
}
</style>
