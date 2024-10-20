<template>
  <li class="text-sm list-none">
    <RouterLink :to="{ name: routeName }" v-slot="{ href, navigate }" custom>
      <a :href="href" @click="navigate" :data-active="isActive">
        <RIcon
          :name="iconName"
          :size="24"
          :color="isActive ? colors['r-primary'] : colors['r-secondary']"
        />
        <RText
          :as="isActive ? 'h6' : 'p'"
          :class="[isActive ? '!text-r-primary' : '!text-r-secondary']"
        >
          {{ label }}
        </RText>
      </a>
    </RouterLink>
  </li>
</template>

<script lang="ts" setup>
import type { EIconNames } from '@/common/enums/icons.enum'
import { colors } from '@/constants/colors'
import type { ERouteNames } from '@/router/routeNames.enum'
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

export interface IProps {
  label: string
  routeName: ERouteNames
  iconName: EIconNames
}
const props = defineProps<IProps>()

const route = useRoute()
const router = useRouter()
const href = router.resolve({ name: props.routeName }).href

const isActive = computed(
  () => route.name === props.routeName || route.fullPath.split('/')[1] === href.split('/')[1]
)
</script>

<style scoped lang="scss">
a {
  @apply flex gap-1 items-center px-3 py-[9px] lg:py-[5px] rounded-lg cursor-pointer hover:border-r-stroke border border-transparent active:bg-r-off-white transition-colors duration-200 ease-in-out;
}

a[data-active='true'] {
  @apply bg-r-white border-r-stroke;
}
</style>
