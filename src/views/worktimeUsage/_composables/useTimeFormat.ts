/**
 * Composable for time formatting in worktime usage views
 * Provides consistent time formatting across all worktime components
 */

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { formatShortTime, formatTimeString, type ITimeUnits } from '@/helpers/time';
import { type MessageSchema } from '@/plugins/i18n';

export const useTimeFormat = () => {
  const { t } = useI18n<{ message: MessageSchema }>();

  // Time units for i18n
  const timeUnits = computed<ITimeUnits>(() => ({
    days: t('common.time.days'),
    hours: t('common.time.hours'),
    minutes: t('common.time.minutes'),
    seconds: t('common.time.seconds'),
  }));

  /**
   * Format duration time string (e.g., "109.23:27" -> "109d 23h 27m")
   * For work/leisure/meeting durations
   */
  const formatDuration = (time: string | undefined): string => {
    if (!time || time === '-') return '-';
    return formatTimeString(time, timeUnits.value);
  };

  /**
   * Format short time string (e.g., "08:05" -> "8h 5m")
   * For start/end times
   */
  const formatTime = (time: string | undefined): string => {
    if (!time || time === '-') return '-';
    return formatShortTime(time, timeUnits.value);
  };

  return {
    timeUnits,
    formatDuration,
    formatTime,
  };
};
