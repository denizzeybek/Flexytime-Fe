import { ref } from 'vue';

import { EStorageKeys } from '@/constants/storageKeys';
import { type Language,setI18nLanguage } from '@/plugins/i18n';

const savedLanguage = localStorage.getItem(EStorageKeys.LANGUAGE) as Language | null;
const currentLanguage = ref<Language>(savedLanguage || 'en');

if (currentLanguage.value) {
  setI18nLanguage(currentLanguage.value);
}

export const useLanguage = () => {
  const initLanguage = async () => {
    const savedLanguage = localStorage.getItem(EStorageKeys.LANGUAGE) as Language | null;
    const language = savedLanguage || 'en';
    currentLanguage.value = language;
    await setI18nLanguage(language);
  };

  const changeLanguage = async (language: Language) => {
    currentLanguage.value = language;
    localStorage.setItem(EStorageKeys.LANGUAGE, language);
    await setI18nLanguage(language);
  };

  const getLanguageOptions = () => {
    return [
      { name: 'English', value: 'en' as Language },
      { name: 'Türkçe', value: 'tr' as Language },
    ];
  };

  return {
    currentLanguage,
    changeLanguage,
    getLanguageOptions,
    initLanguage,
  };
};
