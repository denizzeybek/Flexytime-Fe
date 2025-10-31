import { ref } from 'vue';
import { EStorageKeys } from '@/constants/storageKeys';
import { setI18nLanguage, type Language } from '@/plugins/i18n';

const currentLanguage = ref<Language>('en');

export const useLanguage = () => {
  // Initialize language from localStorage or default to 'en'
  const initLanguage = async () => {
    const savedLanguage = localStorage.getItem(EStorageKeys.LANGUAGE) as Language | null;
    const language = savedLanguage || 'en';
    currentLanguage.value = language;
    await setI18nLanguage(language);
  };

  // Change language and save to localStorage
  const changeLanguage = async (language: Language) => {
    currentLanguage.value = language;
    localStorage.setItem(EStorageKeys.LANGUAGE, language);
    await setI18nLanguage(language);
  };

  // Get language options for select component
  const getLanguageOptions = () => {
    return [
      { name: 'English', value: 'en' as Language },
      { name: 'Türkçe', value: 'tr' as Language },
    ];
  };

  // Initialize on first use
  if (!localStorage.getItem(EStorageKeys.LANGUAGE)) {
    initLanguage();
  } else {
    const savedLanguage = localStorage.getItem(EStorageKeys.LANGUAGE) as Language;
    currentLanguage.value = savedLanguage;
    setI18nLanguage(savedLanguage);
  }

  return {
    currentLanguage,
    changeLanguage,
    getLanguageOptions,
    initLanguage,
  };
};
