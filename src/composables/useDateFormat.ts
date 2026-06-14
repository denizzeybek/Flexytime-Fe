import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const DATE_FORMATS = {
  tr: 'dd.mm.yy',

} as const;

export const useDateFormat = () => {
  const { locale } = useI18n();

  const dateFormat = computed(() => {
    const currentLocale = locale.value as keyof typeof DATE_FORMATS;
    return DATE_FORMATS[currentLocale] || DATE_FORMATS.tr;
  });

  return {
    dateFormat,
  };
};
