<template>
  <div class="relative flex min-h-screen h-screen">
    <AuthAside :ad="ads[adName]" />
    <main class="flex w-full overflow-auto flex-col items-center min-h-screen">
      <div class="px-4 flex justify-between items-center w-full lg:pt-3 mb-10">
        <RouterLink :to="{ name: ERouteNames.Login }" class="flex lg:hidden">
          <RIcon :name="EIconNames.Ruul" :size="72" />
        </RouterLink>
        <RSelect
          name="language"
          :options="languageOptions"
          v-model="language"
          class="max-w-[140px] ms-auto"
        />
      </div>
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { EIconNames } from '@/common/enums/icons.enum'
import { languageOptions, type ILanguageOption } from '@/constants/languages'
import { setI18nLanguage, type MessageSchema } from '@/plugins/i18n'
import { ERouteNames } from '@/router/routeNames.enum'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AuthAside, { type IAd } from './_components/AuthAside.vue'

type TAdName =
  | 'business-invoice-ad'
  | 'crypto-pay-ad'
  | 'fast-pay-ad'
  | 'invoice-ad'
  | 'talent-client-ad'

interface IProps {
  adName: TAdName
}
withDefaults(defineProps<IProps>(), {
  adName: 'invoice-ad'
})

const { locale } = useI18n()
const i18n = useI18n<{ message: MessageSchema }>()
const { t } = i18n

const language = ref<ILanguageOption>(
  languageOptions.find((option) => option.value === locale.value) ?? languageOptions[0]
)

watch(language, (language) => {
  setI18nLanguage(language?.value ?? 'en')
})

const ads = computed<Record<TAdName, IAd>>(() => ({
  'invoice-ad': {
    title: t('pages.auth.login.banner.invoice-ad.title'),
    features: [
      t('pages.auth.login.banner.invoice-ad.feature_1'),
      t('pages.auth.login.banner.invoice-ad.feature_2'),
      t('pages.auth.login.banner.invoice-ad.feature_3')
    ],
    image: {
      name: 'invoice-ad.png',
      alt: 'Invoice'
    }
  },
  'fast-pay-ad': {
    title: t('pages.auth.login.banner.fast-pay-ad.title'),
    features: [
      t('pages.auth.login.banner.fast-pay-ad.feature_1'),
      t('pages.auth.login.banner.fast-pay-ad.feature_2'),
      t('pages.auth.login.banner.fast-pay-ad.feature_3')
    ],
    image: {
      name: 'fast-pay-ad.png',
      alt: 'Fast Pay'
    }
  },
  'talent-client-ad': {
    title: t('pages.auth.login.banner.talent-client-ad.title'),
    features: [
      t('pages.auth.login.banner.talent-client-ad.feature_1'),
      t('pages.auth.login.banner.talent-client-ad.feature_2'),
      t('pages.auth.login.banner.talent-client-ad.feature_3')
    ],
    image: {
      name: 'talent-client-ad.png',
      alt: 'Talent Client Ad'
    }
  },
  'crypto-pay-ad': {
    title: t('pages.auth.login.banner.crypto-pay-ad.title'),
    features: [
      t('pages.auth.login.banner.crypto-pay-ad.feature_1'),
      t('pages.auth.login.banner.crypto-pay-ad.feature_2'),
      t('pages.auth.login.banner.crypto-pay-ad.feature_3')
    ],
    image: {
      name: 'crypto-pay-ad.png',
      alt: 'Crypto Pay Ad'
    }
  },
  'business-invoice-ad': {
    title: t('pages.auth.login.banner.business-invoice-ad.title'),
    features: [
      t('pages.auth.login.banner.business-invoice-ad.feature_1'),
      t('pages.auth.login.banner.business-invoice-ad.feature_2'),
      t('pages.auth.login.banner.business-invoice-ad.feature_3')
    ],
    image: {
      name: 'business-invoice-ad.png',
      alt: 'Business Invoice Ad'
    }
  }
}))
</script>
