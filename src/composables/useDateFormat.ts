import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Date format mappings for different locales
 * Format syntax is for PrimeVue DatePicker:
 * - dd: day with leading zero
 * - mm: month with leading zero
 * - yy: full year
 */
const DATE_FORMATS = {
  tr: 'dd.mm.yy', // DD.MM.YYYY (Turkey)
  // 'en-GB': 'dd/mm/yy', // DD/MM/YYYY (UK)
  // en: 'mm/dd/yy', // MM/DD/YYYY (US - default)
} as const;

/**
 * Composable for managing date formats based on i18n locale
 *
 * @returns dateFormat - Reactive date format string for PrimeVue DatePicker
 *
 * @example
 * ```vue
 * <script setup>
 * import { useDateFormat } from '@/composables/useDateFormat';
 *
 * const { dateFormat } = useDateFormat();
 * </script>
 *
 * <template>
 *   <DatePicker :date-format="dateFormat" />
 * </template>
 * ```
 */
export const useDateFormat = () => {
  const { locale } = useI18n();

  const dateFormat = computed(() => {
    const currentLocale = locale.value as keyof typeof DATE_FORMATS;
    // Default to Turkish format for all locales (dd.mm.yy)
    return DATE_FORMATS[currentLocale] || DATE_FORMATS.tr;
  });

  return {
    dateFormat,
  };
};
