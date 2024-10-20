<template>
  <aside class="min-w-[400px] max-w-[400] h-full hidden lg:flex relative flex-col min-h-screen">
    <RouterLink :to="{ name: ERouteNames.Login }" class="mt-8 mb-6 ml-11 w-fit">
      <RIcon :name="EIconNames.Ruul" :size="63" :color="colors['r-white']" />
    </RouterLink>

    <section class="px-11">
      <RText as="h1" class="mb-5 !text-r-off-white">{{ ad.title }}</RText>
      <ul class="flex flex-col gap-3">
        <li v-for="f of ad.features" :key="f" class="flex items-start gap-2">
          <RIcon :name="EIconNames.Checkmark" :color="colors['r-off-white']" />
          <RText as="h5" class="!text-r-off-white">{{ f }}</RText>
        </li>
      </ul>
    </section>
    <img :src="src" :alt="ad.image.alt" />
  </aside>
</template>

<script lang="ts" setup>
import { EIconNames } from '@/common/enums/icons.enum'
import { colors } from '@/constants/colors'
import { ERouteNames } from '@/router/routeNames.enum'
import { computed } from 'vue'

export interface IAd {
  title: string
  features: string[]
  image: {
    name: string
    alt: string
  }
}

interface IProps {
  ad: IAd
}
const props = defineProps<IProps>()

const src = computed(() => `/images/onboarding/${props.ad.image.name}`)
</script>

<style lang="scss" scoped>
aside {
  background-image: url('/images/onboarding/bg.png');
}

img {
  @apply absolute bottom-0 w-[400px];

  @media (height > 900px) {
    @apply static mt-[120px];
  }
}
</style>
