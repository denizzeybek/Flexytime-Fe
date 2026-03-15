/**
 * Composable for time formatting in worktime usage views
 * Provides consistent time formatting across all worktime components
 */

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { formatShortTime, formatTimeString, isTimeFormat, type ITimeUnits } from '@/helpers/time';
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
   * If the value is already formatted (e.g., "0 ₺", "50%"), return as-is
   */
  const formatDuration = (time: string | undefined): string => {
    if (!time || time === '-') return '-';

    // If it's not a time format (contains currency, % or other non-time chars),
    // return as-is since it's already formatted by the backend
    if (!isTimeFormat(time) && !/^\d+$/.test(time)) {
      return time;
    }

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
