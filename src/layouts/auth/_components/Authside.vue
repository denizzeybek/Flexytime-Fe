<template>
  <aside
    class="min-w-[400px] max-w-[400] h-full hidden lg:flex relative flex-col min-h-screen bg-f-light-purple"
  >
    <RouterLink
      :to="{ name: ERouteNames.Login }"
      class="flex items-center justify-center w-full h-fit"
    >
      <img class="!w-60" src="@/components/images/login-logo.png" />
    </RouterLink>

    <section class="px-11 mt-12">
      <FText as="h1" class="mb-12 !text-f-black">{{ ad.title }}</FText>
      <ul class="flex flex-col gap-3">
        <li v-for="f of ad.features" :key="f" class="flex items-center gap-4">
          <span class="pi pi-check"></span>
          <FText as="h5" class="!text-r-off-white">{{ f }}</FText>
        </li>
      </ul>
    </section>
    <img :src="src" :alt="ad.image.alt" v-if="ad?.image?.alt" />
  </aside>
</template>

<script lang="ts" setup>
import { EIconNames } from '@/common/enums/icons.enum';
import { colors } from '@/constants/colors';
import { ERouteNames } from '@/router/routeNames.enum';
import { computed } from 'vue';

export interface IAd {
  title: string;
  features: string[];
  image?: {
    name: string;
    alt: string;
  };
}

interface IProps {
  ad: IAd;
}
const props = defineProps<IProps>();

const src = computed(() => `/images/onboarding/${props.ad?.image?.name}`);
</script>

<style lang="scss" scoped>
// aside {
//   background-image: url('/images/onboarding/bg.png');
// }

img {
  @apply absolute bottom-0 w-[400px];

  @media (height > 900px) {
    @apply static mt-[120px];
  }
}
</style>
