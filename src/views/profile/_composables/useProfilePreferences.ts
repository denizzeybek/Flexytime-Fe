import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFToast } from '@/composables/useFToast';
import { useLanguage } from '@/composables/useLanguage';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';

interface NamedValue<T> {
  name: string | undefined;
  value: T | undefined;
}

export const useProfilePreferences = () => {
  const { t } = useI18n<{ message: MessageSchema }>();
  const { showSuccessMessage, showErrorMessage } = useFToast();
  const profileStore = useProfileStore();
  const { currentLanguage, changeLanguage, getLanguageOptions } = useLanguage();

  const isLanguageLoading = ref(false);
  const isTimezoneLoading = ref(false);
  const isCurrencyLoading = ref(false);

  const languageOptions = getLanguageOptions();
  const selectedLanguage = ref<{ name: string; value: 'en' | 'tr' } | undefined>(
    languageOptions.find((lang) => lang.value === currentLanguage.value),
  );

  const timeZoneList = computed<NamedValue<string>[]>(() =>
    profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })) ?? [],
  );
  const selectedTimezone = ref<NamedValue<string> | undefined>();

  const currencyList = computed<NamedValue<string>[]>(() =>
    profileStore?.CurrencyList?.map((item) => ({ name: item.Name, value: item.ID })) ?? [],
  );
  const selectedCurrency = ref<NamedValue<string> | undefined>();

  const handleLanguageChange = async (option: { name: string; value: 'en' | 'tr' }) => {
    if (!option?.value) return;
    isLanguageLoading.value = true;
    try {
      await profileStore.updateLanguageCode(option.value);
      await changeLanguage(option.value);
      showSuccessMessage(t('pages.profile.basic.messages.languageUpdated'));
    } catch {
      showErrorMessage(t('common.errors.generic'));
    } finally {
      isLanguageLoading.value = false;
    }
  };

  const handleTimezoneChange = async (option: { name: string; value: string }) => {
    if (!option?.value) return;
    isTimezoneLoading.value = true;
    try {
      await profileStore.updateTimezone(option.value);
      showSuccessMessage(t('pages.profile.basic.messages.timezoneUpdated'));
    } catch {
      showErrorMessage(t('common.errors.generic'));
    } finally {
      isTimezoneLoading.value = false;
    }
  };

  const handleCurrencyChange = async (option: { name: string; value: string }) => {
    if (!option?.value) return;
    isCurrencyLoading.value = true;
    try {
      await profileStore.updateCurrency(option.value);
      showSuccessMessage(t('pages.profile.basic.messages.currencyUpdated'));
    } catch {
      showErrorMessage(t('common.errors.generic'));
    } finally {
      isCurrencyLoading.value = false;
    }
  };

  watch(currentLanguage, (newLang) => {
    selectedLanguage.value = languageOptions.find((lang) => lang.value === newLang);
  });

  const bootstrap = async () => {
    await Promise.all([profileStore.fetchTimezones(), profileStore.fetchCurrencies()]);
    selectedLanguage.value = languageOptions.find((lang) => lang.value === currentLanguage.value);
    const timeZone = profileStore?.TimeZone;
    selectedTimezone.value = timeZoneList.value.find((item) => item.value === timeZone);
    const currency = profileStore?.Currency ?? 'TRY';
    selectedCurrency.value = currencyList.value.find((item) => item.value === currency);
  };

  onMounted(() => {
    void bootstrap();
  });

  return {
    languageOptions,
    timeZoneList,
    currencyList,
    selectedLanguage,
    selectedTimezone,
    selectedCurrency,
    isLanguageLoading,
    isTimezoneLoading,
    isCurrencyLoading,
    handleLanguageChange,
    handleTimezoneChange,
    handleCurrencyChange,
  };
};
