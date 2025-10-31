<template>
  <div class="relative flex min-h-screen h-screen">
    <AuthAside :ad="ads[adName]" />
    <main class="flex w-full overflow-auto flex-col items-center min-h-screen bg-f-tertiary-purple">
      <div class="px-4 flex justify-between items-center w-full lg:pt-3 mb-10">
        <FSelect
          name="language"
          :value="selectedLanguage"
          :options="languageOptions"
          @update:model-value="handleLanguageChange"
          class="max-w-[140px] ms-auto"
        />
      </div>
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import AuthAside from './_components/Authside.vue';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useI18n<{ message: MessageSchema }>();
const { currentLanguage, changeLanguage, getLanguageOptions } = useLanguage();

type TAdName = 'login' | 'register' | 'download' | 'forgot-password';

interface IProps {
  adName: TAdName;
}
withDefaults(defineProps<IProps>(), {
  adName: 'login',
});

const languageOptions = getLanguageOptions();

const selectedLanguage = computed(() => {
  return languageOptions.find(lang => lang.value === currentLanguage.value);
});

const handleLanguageChange = (option: { name: string; value: 'en' | 'tr' }) => {
  if (option && option.value) {
    changeLanguage(option.value);
  }
};

const ads = computed(() => {
  return {
    login: {
      title: t('pages.auth.authLayout.ads.login.title'),
      features: [
        t('pages.auth.authLayout.ads.login.features.feature1'),
        t('pages.auth.authLayout.ads.login.features.feature2'),
        t('pages.auth.authLayout.ads.login.features.feature3'),
        t('pages.auth.authLayout.ads.login.features.feature4'),
        t('pages.auth.authLayout.ads.login.features.feature5'),
        t('pages.auth.authLayout.ads.login.features.feature6'),
        t('pages.auth.authLayout.ads.login.features.feature7'),
      ],
      // image: {
      //   name: 'business-invoice-ad.png',
      //   alt: 'Login',
      // },
    },
    register: {
      title: t('pages.auth.authLayout.ads.register.title'),
      features: [
        t('pages.auth.authLayout.ads.register.features.feature1'),
        t('pages.auth.authLayout.ads.register.features.feature2'),
        t('pages.auth.authLayout.ads.register.features.feature3'),
        t('pages.auth.authLayout.ads.register.features.feature4'),
        t('pages.auth.authLayout.ads.register.features.feature5'),
        t('pages.auth.authLayout.ads.register.features.feature6'),
        t('pages.auth.authLayout.ads.register.features.feature7'),
      ],
    },
    download: {
      title: t('pages.auth.authLayout.ads.download.title'),
      features: [
        t('pages.auth.authLayout.ads.download.features.feature1'),
        t('pages.auth.authLayout.ads.download.features.feature2'),
        t('pages.auth.authLayout.ads.download.features.feature3'),
        t('pages.auth.authLayout.ads.download.features.feature4'),
        t('pages.auth.authLayout.ads.download.features.feature5'),
        t('pages.auth.authLayout.ads.download.features.feature6'),
        t('pages.auth.authLayout.ads.download.features.feature7'),
      ],
    },
    'forgot-password': {
      title: t('pages.auth.authLayout.ads.forgotPassword.title'),
      features: [
        t('pages.auth.authLayout.ads.forgotPassword.features.feature1'),
        t('pages.auth.authLayout.ads.forgotPassword.features.feature2'),
        t('pages.auth.authLayout.ads.forgotPassword.features.feature3'),
        t('pages.auth.authLayout.ads.forgotPassword.features.feature4'),
        t('pages.auth.authLayout.ads.forgotPassword.features.feature5'),
        t('pages.auth.authLayout.ads.forgotPassword.features.feature6'),
        t('pages.auth.authLayout.ads.forgotPassword.features.feature7'),
      ],
    },
  };
});
</script>
