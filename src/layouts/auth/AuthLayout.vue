<template>
  <div class="relative flex h-screen overflow-hidden">
    <!-- AuthAside hidden for cleaner login experience -->
    <!-- <AuthAside :ad="ads[adName]" /> -->

    <main class="flex w-full flex-col items-center h-screen bg-f-tertiary-purple overflow-y-auto">
      <div class="px-4 flex justify-between items-center w-full py-3">
        <FSelect
          v-model="selectedLanguageModel"
          name="language"
          :options="languageOptions"
          class="max-w-[140px] ms-auto"
          @update:model-value="handleLanguageChange"
        />
      </div>
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useLanguage } from '@/composables/useLanguage';
import { type MessageSchema } from '@/plugins/i18n';

import AuthAside from './_components/Authside.vue';

type TAdName = 'login' | 'register' | 'download' | 'forgot-password';

interface IProps {
  adName: TAdName;
}

withDefaults(defineProps<IProps>(), {
  adName: 'login',
});

const { t } = useI18n<{ message: MessageSchema }>();
const { currentLanguage, changeLanguage, getLanguageOptions } = useLanguage();

const languageOptions = getLanguageOptions();

const selectedLanguageModel = ref(languageOptions.find(lang => lang.value === currentLanguage.value));

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

const handleLanguageChange = async (option: { name: string; value: 'en' | 'tr' }) => {
  if (option && option.value) {
    await changeLanguage(option.value);
  }
};

watch(currentLanguage, (newLang) => {
  selectedLanguageModel.value = languageOptions.find(lang => lang.value === newLang);
});
</script>
