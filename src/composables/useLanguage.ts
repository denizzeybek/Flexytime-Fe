import { ref } from 'vue';
import { EStorageKeys } from '@/constants/storageKeys';
import { setI18nLanguage, type Language } from '@/plugins/i18n';

// Initialize currentLanguage from localStorage immediately
const savedLanguage = localStorage.getItem(EStorageKeys.LANGUAGE) as Language | null;
const currentLanguage = ref<Language>(savedLanguage || 'en');

// Set i18n language on module load
if (currentLanguage.value) {
  setI18nLanguage(currentLanguage.value);
}

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

  return {
    currentLanguage,
    changeLanguage,
    getLanguageOptions,
    initLanguage,
  };
};
