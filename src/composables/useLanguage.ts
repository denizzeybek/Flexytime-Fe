import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { EStorageKeys } from '@/constants/storageKeys';

type TLanguage = 'en' | 'tr';

const currentLanguage = ref<TLanguage>('en');

export const useLanguage = () => {
  const { locale } = useI18n();

  // Initialize language from localStorage or default to 'en'
  const initLanguage = () => {
    const savedLanguage = localStorage.getItem(EStorageKeys.LANGUAGE) as TLanguage | null;
    const language = savedLanguage || 'en';
    currentLanguage.value = language;
    locale.value = language;
  };

  // Change language and save to localStorage
  const changeLanguage = (language: TLanguage) => {
    currentLanguage.value = language;
    locale.value = language;
    localStorage.setItem(EStorageKeys.LANGUAGE, language);
  };

  // Get language options for select component
  const getLanguageOptions = () => {
    return [
      { name: 'English', value: 'en' as TLanguage },
      { name: 'Türkçe', value: 'tr' as TLanguage },
    ];
  };

  // Initialize on first use
  if (!localStorage.getItem(EStorageKeys.LANGUAGE)) {
    initLanguage();
  } else {
    const savedLanguage = localStorage.getItem(EStorageKeys.LANGUAGE) as TLanguage;
    currentLanguage.value = savedLanguage;
    locale.value = savedLanguage;
  }

  return {
    currentLanguage,
    changeLanguage,
    getLanguageOptions,
    initLanguage,
  };
};
